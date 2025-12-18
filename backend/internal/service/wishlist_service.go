package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
)

type wishlistService struct {
	repo domain.WishlistRepository
}

func NewWishlistService(repo domain.WishlistRepository) domain.WishlistService {
	return &wishlistService{repo: repo}
}

func (s *wishlistService) ToggleWishlist(ctx context.Context, userID, productID uuid.UUID) (string, error) {
	added, err := s.repo.Toggle(ctx, userID, productID)
	if err != nil {
		return "", err
	}
	if added {
		return "added", nil
	}
	return "removed", nil
}

func (s *wishlistService) GetMyWishlist(ctx context.Context, userID uuid.UUID) ([]domain.Wishlist, error) {
	return s.repo.GetByUserID(ctx, userID)
}
