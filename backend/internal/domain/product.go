package domain

import (
	"context"
	"time"

	"github.com/google/uuid"
)

// Category Entity
type Category struct {
	ID        uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name      string    `json:"name" gorm:"unique;not null"`
	Slug      string    `json:"slug" gorm:"unique;index"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// Product Entity
type Product struct {
	ID          uuid.UUID `json:"id" gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name        string    `json:"name" gorm:"not null;index"`
	Slug        string    `json:"slug" gorm:"unique;index"`
	Description string    `json:"description" gorm:"type:text"`
	Price       float64   `json:"price" gorm:"not null;check:price > 0"`
	Stock       int       `json:"stock" gorm:"not null;check:stock >= 0"`
	ImageURL    string    `json:"image_url"`
	CategoryID  uuid.UUID `json:"category_id" gorm:"type:uuid;not null"`
	Category    Category  `json:"category" gorm:"foreignKey:CategoryID"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Payload structs for Requests
type CreateCategoryRequest struct {
	Name string `json:"name" validate:"required"`
}

type CreateProductRequest struct {
	Name        string    `json:"name" validate:"required"`
	Description string    `json:"description"`
	Price       float64   `json:"price" validate:"required,min=0.01"`
	Stock       int       `json:"stock" validate:"required,min=0"`
	CategoryID  uuid.UUID `json:"category_id" validate:"required"`
	ImageURL    string    `json:"image_url"`
}

// Interfaces
type CategoryRepository interface {
	Create(ctx context.Context, category *Category) error
	FindAll(ctx context.Context) ([]Category, error)
	FindByID(ctx context.Context, id uuid.UUID) (*Category, error)
	Update(ctx context.Context, category *Category) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type ProductRepository interface {
	Create(ctx context.Context, product *Product) error
	FindAll(ctx context.Context, params ProductQueryParams) ([]Product, int64, error)
	FindByID(ctx context.Context, id uuid.UUID) (*Product, error)
	FindBySlug(ctx context.Context, slug string) (*Product, error)
	Update(ctx context.Context, product *Product) error
	Delete(ctx context.Context, id uuid.UUID) error
}

type ProductQueryParams struct {
	Page       int
	Limit      int
	Search     string
	CategoryID string
	SortBy     string
}
