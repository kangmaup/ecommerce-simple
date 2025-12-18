package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// Address Entity
type Address struct {
	ID            uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID        uuid.UUID `json:"user_id" gorm:"type:uuid;not null;index"`
	User          User      `json:"-" gorm:"foreignKey:UserID"` // JSON ignore user to prevent cycle/bloat
	RecipientName string    `json:"recipient_name" gorm:"not null"`
	PhoneNumber   string    `json:"phone_number" gorm:"not null"`
	Street        string    `json:"street" gorm:"type:text;not null"`
	City          string    `json:"city" gorm:"not null"`
	State         string    `json:"state" gorm:"not null"`
	ZipCode       string    `json:"zip_code" gorm:"not null"`
	IsPrimary     bool      `json:"is_primary" gorm:"default:false"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// DTOs
type CreateAddressRequest struct {
	RecipientName string `json:"recipient_name" validate:"required"`
	PhoneNumber   string `json:"phone_number" validate:"required"`
	Street        string `json:"street" validate:"required"`
	City          string `json:"city" validate:"required"`
	State         string `json:"state" validate:"required"`
	ZipCode       string `json:"zip_code" validate:"required"`
	IsPrimary     bool   `json:"is_primary"`
}

type UpdateAddressRequest struct {
	RecipientName string `json:"recipient_name"`
	PhoneNumber   string `json:"phone_number"`
	Street        string `json:"street"`
	City          string `json:"city"`
	State         string `json:"state"`
	ZipCode       string `json:"zip_code"`
	IsPrimary     *bool  `json:"is_primary"` // Pointer to distinguish false vs nil
}

// Repository Interface
type AddressRepository interface {
	Create(ctx context.Context, address *Address) error
	FindAllByUserID(ctx context.Context, userID uuid.UUID) ([]Address, error)
	FindByID(ctx context.Context, id uuid.UUID) (*Address, error)
	Update(ctx context.Context, address *Address) error
	Delete(ctx context.Context, id uuid.UUID) error
	UnsetPrimaryForUser(ctx context.Context, userID uuid.UUID) error
	CountByUserID(ctx context.Context, userID uuid.UUID) (int64, error)
}
