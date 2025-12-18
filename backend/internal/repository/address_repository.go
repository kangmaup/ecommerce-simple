package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
	"gorm.io/gorm"
)

type addressRepository struct {
	db *gorm.DB
}

func NewAddressRepository(db *gorm.DB) domain.AddressRepository {
	return &addressRepository{db: db}
}

func (r *addressRepository) Create(ctx context.Context, address *domain.Address) error {
	return r.db.WithContext(ctx).Create(address).Error
}

func (r *addressRepository) FindAllByUserID(ctx context.Context, userID uuid.UUID) ([]domain.Address, error) {
	var addresses []domain.Address
	// Order by Primary first, then CreatedAt desc
	err := r.db.WithContext(ctx).
		Where("user_id = ?", userID).
		Order("is_primary desc, created_at desc").
		Find(&addresses).Error
	return addresses, err
}

func (r *addressRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Address, error) {
	var address domain.Address
	err := r.db.WithContext(ctx).First(&address, "id = ?", id).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &address, nil
}

func (r *addressRepository) Update(ctx context.Context, address *domain.Address) error {
	return r.db.WithContext(ctx).Save(address).Error
}

func (r *addressRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&domain.Address{}, "id = ?", id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *addressRepository) UnsetPrimaryForUser(ctx context.Context, userID uuid.UUID) error {
	return r.db.WithContext(ctx).
		Model(&domain.Address{}).
		Where("user_id = ?", userID).
		Update("is_primary", false).Error
}

func (r *addressRepository) CountByUserID(ctx context.Context, userID uuid.UUID) (int64, error) {
	var count int64
	err := r.db.WithContext(ctx).Model(&domain.Address{}).Where("user_id = ?", userID).Count(&count).Error
	return count, err
}
