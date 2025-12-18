package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
	"gorm.io/gorm"
)

type productRepository struct {
	db *gorm.DB
}

func NewProductRepository(db *gorm.DB) domain.ProductRepository {
	return &productRepository{db: db}
}

func (r *productRepository) Create(ctx context.Context, product *domain.Product) error {
	return r.db.WithContext(ctx).Create(product).Error
}

func (r *productRepository) FindAll(ctx context.Context, params domain.ProductQueryParams) ([]domain.Product, int64, error) {
	var products []domain.Product
	var total int64

	query := r.db.WithContext(ctx).Model(&domain.Product{}).Preload("Category")

	if params.Search != "" {
		query = query.Where("name ILIKE ?", "%"+params.Search+"%")
	}
	if params.CategoryID != "" {
		query = query.Where("category_id = ?", params.CategoryID)
	}

	if err := query.Count(&total).Error; err != nil {
		return nil, 0, err
	}

	offset := (params.Page - 1) * params.Limit
	if err := query.Offset(offset).Limit(params.Limit).Find(&products).Error; err != nil {
		return nil, 0, err
	}

	return products, total, nil
}

func (r *productRepository) FindByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	var product domain.Product
	if err := r.db.WithContext(ctx).Preload("Category").First(&product, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) FindBySlug(ctx context.Context, slug string) (*domain.Product, error) {
	var product domain.Product
	if err := r.db.WithContext(ctx).Preload("Category").Where("slug = ?", slug).First(&product).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, domain.ErrNotFound
		}
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) Update(ctx context.Context, product *domain.Product) error {
	return r.db.WithContext(ctx).Save(product).Error
}

func (r *productRepository) Delete(ctx context.Context, id uuid.UUID) error {
	result := r.db.WithContext(ctx).Delete(&domain.Product{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return domain.ErrNotFound
	}
	return nil
}
