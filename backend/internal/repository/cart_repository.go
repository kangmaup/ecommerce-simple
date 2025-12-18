package repository

import (
	"context"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
	"gorm.io/gorm"
)

type cartRepository struct {
	db *gorm.DB
}

func NewCartRepository(db *gorm.DB) domain.CartRepository {
	return &cartRepository{db: db}
}

func (r *cartRepository) FindBytesUserID(ctx context.Context, userID uuid.UUID) (*domain.Cart, error) {
	var cart domain.Cart
	// Preload Items and the Product details within items
	err := r.db.WithContext(ctx).
		Preload("Items", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at desc") // Show newest items first
		}).
		Preload("Items.Product").
		Where("user_id = ?", userID).
		First(&cart).Error
	
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil // Return nil if no cart found, let service handle creation
		}
		return nil, err
	}
	return &cart, nil
}

func (r *cartRepository) Create(ctx context.Context, cart *domain.Cart) error {
	return r.db.WithContext(ctx).Create(cart).Error
}

func (r *cartRepository) AddItem(ctx context.Context, item *domain.CartItem) error {
    // Check if item exists in cart
    var existingItem domain.CartItem
    err := r.db.WithContext(ctx).
        Where("cart_id = ? AND product_id = ?", item.CartID, item.ProductID).
        First(&existingItem).Error
    
    if err == nil {
        // Update quantity if exists
        existingItem.Quantity += item.Quantity
        return r.db.WithContext(ctx).Save(&existingItem).Error
    }
    
    // Create new if not exists
	return r.db.WithContext(ctx).Create(item).Error
}

func (r *cartRepository) UpdateItem(ctx context.Context, item *domain.CartItem) error {
	return r.db.WithContext(ctx).Save(item).Error
}

func (r *cartRepository) RemoveItem(ctx context.Context, itemID uuid.UUID) error {
	return r.db.WithContext(ctx).Delete(&domain.CartItem{}, itemID).Error
}

func (r *cartRepository) ClearCart(ctx context.Context, cartID uuid.UUID) error {
	return r.db.WithContext(ctx).Where("cart_id = ?", cartID).Delete(&domain.CartItem{}).Error
}
