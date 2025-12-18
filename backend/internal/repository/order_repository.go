package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
	"gorm.io/gorm"
)

type orderRepository struct {
	db *gorm.DB
}

func NewOrderRepository(db *gorm.DB) domain.OrderRepository {
	return &orderRepository{db: db}
}

func (r *orderRepository) Create(ctx context.Context, order *domain.Order) error {
	return r.db.WithContext(ctx).Create(order).Error
}

func (r *orderRepository) FindAllByUserID(ctx context.Context, userID uuid.UUID) ([]domain.Order, error) {
	var orders []domain.Order
	err := r.db.WithContext(ctx).
		Preload("Items").
		Preload("Items.Product").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&orders).Error
	return orders, err
}

func (r *orderRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Order, error) {
	var order domain.Order
	err := r.db.WithContext(ctx).
		Preload("Items").
		Preload("Items.Product").
		First(&order, id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	return r.db.WithContext(ctx).Model(&domain.Order{}).Where("id = ?", id).Update("status", status).Error
}

func (r *orderRepository) FindAll(ctx context.Context) ([]domain.Order, error) {
	var orders []domain.Order
	err := r.db.WithContext(ctx).
		Preload("Items").
		Preload("Items.Product").
		Preload("User"). // Also need User info for admin
		Order("created_at desc").
		Find(&orders).Error
	return orders, err
}
