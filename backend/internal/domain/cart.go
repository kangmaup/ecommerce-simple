package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// Cart Entity
type Cart struct {
	ID        uuid.UUID  `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID    uuid.UUID  `json:"user_id" gorm:"type:uuid;not null;unique"` // One cart per user
	Items     []CartItem `json:"items" gorm:"foreignKey:CartID"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
}

// CartItem Entity
type CartItem struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	CartID    uuid.UUID `json:"cart_id" gorm:"type:uuid;not null"`
	ProductID uuid.UUID `json:"product_id" gorm:"type:uuid;not null"`
	Product   Product   `json:"product" gorm:"foreignKey:ProductID"`
	Quantity  int       `json:"quantity" gorm:"not null;check:quantity > 0"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Interfaces
type CartRepository interface {
	FindBytesUserID(ctx context.Context, userID uuid.UUID) (*Cart, error)
	Create(ctx context.Context, cart *Cart) error
	AddItem(ctx context.Context, item *CartItem) error
	UpdateItem(ctx context.Context, item *CartItem) error
	RemoveItem(ctx context.Context, itemID uuid.UUID) error
	ClearCart(ctx context.Context, cartID uuid.UUID) error
}

type AddToCartRequest struct {
	ProductID uuid.UUID `json:"product_id" validate:"required"`
	Quantity  int       `json:"quantity" validate:"required,min=1"`
}

type UpdateCartItemRequest struct {
	Quantity int `json:"quantity" validate:"required,min=1"`
}
