package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
	"github.com/user/go-ecommerce/pkg/utils"
)

type categoryService struct {
	repo domain.CategoryRepository
}

type CategoryService interface {
	Create(ctx context.Context, req domain.CreateCategoryRequest) error
	FindAll(ctx context.Context) ([]domain.Category, error)
	FindByID(ctx context.Context, id uuid.UUID) (*domain.Category, error)
	Update(ctx context.Context, id uuid.UUID, req domain.CreateCategoryRequest) error
	Delete(ctx context.Context, id uuid.UUID) error
}

func NewCategoryService(repo domain.CategoryRepository) CategoryService {
	return &categoryService{repo: repo}
}

func (s *categoryService) Create(ctx context.Context, req domain.CreateCategoryRequest) error {
	slug := utils.MakeSlug(req.Name)
	category := &domain.Category{
		Name: req.Name,
		Slug: slug,
	}
	return s.repo.Create(ctx, category)
}

func (s *categoryService) FindAll(ctx context.Context) ([]domain.Category, error) {
	return s.repo.FindAll(ctx)
}

func (s *categoryService) FindByID(ctx context.Context, id uuid.UUID) (*domain.Category, error) {
	return s.repo.FindByID(ctx, id)
}

func (s *categoryService) Update(ctx context.Context, id uuid.UUID, req domain.CreateCategoryRequest) error {
	category, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if req.Name != "" {
		category.Name = req.Name
		category.Slug = utils.MakeSlug(req.Name)
	}

	return s.repo.Update(ctx, category)
}

func (s *categoryService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}
