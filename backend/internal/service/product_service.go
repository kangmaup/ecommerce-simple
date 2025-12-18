package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
	"github.com/user/go-ecommerce/pkg/utils"
)

type productService struct {
	repo         domain.ProductRepository
	categoryRepo domain.CategoryRepository
}

type ProductService interface {
	Create(ctx context.Context, req domain.CreateProductRequest) error
	FindAll(ctx context.Context, params domain.ProductQueryParams) ([]domain.Product, int64, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Product, error)
	FindBySlug(ctx context.Context, slug string) (*domain.Product, error)
	Update(ctx context.Context, id uuid.UUID, req domain.CreateProductRequest) error
	Delete(ctx context.Context, id uuid.UUID) error
}

func NewProductService(repo domain.ProductRepository, categoryRepo domain.CategoryRepository) ProductService {
	return &productService{
		repo:         repo,
		categoryRepo: categoryRepo,
	}
}

func (s *productService) Create(ctx context.Context, req domain.CreateProductRequest) error {
	// Validate Category
	if _, err := s.categoryRepo.FindByID(ctx, req.CategoryID); err != nil {
		return err // Could verify if specific error needed
	}

	slug := utils.MakeSlug(req.Name)
	// Ideally check strict uniqueness of slug here

	product := &domain.Product{
		Name:        req.Name,
		Slug:        slug,
		Description: req.Description,
		Price:       req.Price,
		Stock:       req.Stock,
		CategoryID:  req.CategoryID,
		ImageURL:    req.ImageURL,
	}
	return s.repo.Create(ctx, product)
}

func (s *productService) FindAll(ctx context.Context, params domain.ProductQueryParams) ([]domain.Product, int64, error) {
	if params.Page <= 0 {
		params.Page = 1
	}
	if params.Limit <= 0 {
		params.Limit = 10
	}
	return s.repo.FindAll(ctx, params)
}

func (s *productService) FindByID(ctx context.Context, id uuid.UUID) (*domain.Product, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *productService) FindBySlug(ctx context.Context, slug string) (*domain.Product, error) {
	return s.repo.FindBySlug(ctx, slug)
}

func (s *productService) Update(ctx context.Context, id uuid.UUID, req domain.CreateProductRequest) error {
	product, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	// Validate Category if changed
	if req.CategoryID != uuid.Nil && req.CategoryID != product.CategoryID {
		if _, err := s.categoryRepo.FindByID(ctx, req.CategoryID); err != nil {
			return err
		}
		product.CategoryID = req.CategoryID
	}

	if req.Name != "" {
		product.Name = req.Name
		product.Slug = utils.MakeSlug(req.Name)
	}
	if req.Description != "" {
		product.Description = req.Description
	}
	if req.Price > 0 {
		product.Price = req.Price
	}
	if req.Stock >= 0 {
		product.Stock = req.Stock
	}
	if req.ImageURL != "" {
		product.ImageURL = req.ImageURL
	}

	return s.repo.Update(ctx, product)
}

func (s *productService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}
