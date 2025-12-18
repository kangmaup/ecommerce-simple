package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
	"gorm.io/gorm"
)

type wishlistRepository struct {
	db *gorm.DB
}

func NewWishlistRepository(db *gorm.DB) domain.WishlistRepository {
	return &wishlistRepository{db: db}
}

func (r *wishlistRepository) Toggle(ctx context.Context, userID, productID uuid.UUID) (bool, error) {
	var wishlist domain.Wishlist
	err := r.db.WithContext(ctx).
		Where("user_id = ? AND product_id = ?", userID, productID).
		First(&wishlist).Error

	switch err {
	case nil:
		// Found -> Remove
		if err := r.db.WithContext(ctx).Delete(&wishlist).Error; err != nil {
			return false, err
		}
		return false, nil // Removed
	case gorm.ErrRecordNotFound:
		// Not Found -> Add
		newWishlist := domain.Wishlist{
			UserID:    userID,
			ProductID: productID,
		}
		if err := r.db.WithContext(ctx).Create(&newWishlist).Error; err != nil {
			return false, err
		}
		return true, nil // Added
	default:
		return false, err
	}
}

func (r *wishlistRepository) GetByUserID(ctx context.Context, userID uuid.UUID) ([]domain.Wishlist, error) {
	var wishlists []domain.Wishlist
	err := r.db.WithContext(ctx).
		Preload("Product").
		Where("user_id = ?", userID).
		Order("created_at desc").
		Find(&wishlists).Error
	return wishlists, err
}

func (r *wishlistRepository) Check(ctx context.Context, userID, productID uuid.UUID) (bool, error) {
	var count int64
	err := r.db.WithContext(ctx).
		Model(&domain.Wishlist{}).
		Where("user_id = ? AND product_id = ?", userID, productID).
		Count(&count).Error
	return count > 0, err
}
