package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

type Wishlist struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID    uuid.UUID `json:"user_id" gorm:"type:uuid;not null"`
	ProductID uuid.UUID `json:"product_id" gorm:"type:uuid;not null"`
	Product   Product   `json:"product" gorm:"foreignKey:ProductID"`
	CreatedAt time.Time `json:"created_at"`
}

type WishlistRepository interface {
	Toggle(ctx context.Context, userID, productID uuid.UUID) (bool, error) // Returns true: added, false: removed
	GetByUserID(ctx context.Context, userID uuid.UUID) ([]Wishlist, error)
	Check(ctx context.Context, userID, productID uuid.UUID) (bool, error)
}

type WishlistService interface {
	ToggleWishlist(ctx context.Context, userID, productID uuid.UUID) (string, error) // "added" or "removed"
	GetMyWishlist(ctx context.Context, userID uuid.UUID) ([]Wishlist, error)
}

type ToggleWishlistRequest struct {
	ProductID uuid.UUID `json:"product_id" validate:"required"`
}
