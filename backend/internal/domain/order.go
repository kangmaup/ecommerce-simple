package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// Order Status Enum
const (
	OrderStatusPending   = "pending"
	OrderStatusPaid      = "paid"
	OrderStatusShipped   = "shipped"
	OrderStatusCompleted = "completed"
	OrderStatusCancelled = "cancelled"
)

// Order Entity
type Order struct {
	ID          uuid.UUID   `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID      uuid.UUID   `json:"user_id" gorm:"type:uuid;not null"`
	User        User        `json:"user" gorm:"foreignKey:UserID"`
	Items       []OrderItem `json:"items" gorm:"foreignKey:OrderID"`
	TotalAmount float64     `json:"total_amount" gorm:"not null"` // Snapshot of total price
	Status      string      `json:"status" gorm:"default:'pending'"`
	SnapURL     string      `json:"snap_url"` // For Midtrans (Phase 3b)
	CreatedAt   time.Time   `json:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at"`
}

// OrderItem Entity
type OrderItem struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	OrderID   uuid.UUID `json:"order_id" gorm:"type:uuid;not null"`
	ProductID uuid.UUID `json:"product_id" gorm:"type:uuid;not null"`
	Product   Product   `json:"product" gorm:"foreignKey:ProductID"`
	Quantity  int       `json:"quantity" gorm:"not null"`
	Price     float64   `json:"price" gorm:"not null"` // Snapshot of product price
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Interfaces
type OrderRepository interface {
	Create(ctx context.Context, order *Order) error
	FindAllByUserID(ctx context.Context, userID uuid.UUID) ([]Order, error)
	FindByID(ctx context.Context, id uuid.UUID) (*Order, error)
	UpdateStatus(ctx context.Context, id uuid.UUID, status string) error
	FindAll(ctx context.Context) ([]Order, error)
}

type CheckoutRequest struct {
	// PaymentMethod string // Future expansion
}
