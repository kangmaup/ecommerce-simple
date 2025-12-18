package service

import (
	"context"
	"errors"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
)

type AddressService interface {
	Create(ctx context.Context, userID uuid.UUID, req domain.CreateAddressRequest) error
	GetMyAddresses(ctx context.Context, userID uuid.UUID) ([]domain.Address, error)
	Update(ctx context.Context, userID uuid.UUID, addressID uuid.UUID, req domain.UpdateAddressRequest) error
	Delete(ctx context.Context, userID uuid.UUID, addressID uuid.UUID) error
}

type addressService struct {
	repo domain.AddressRepository
}

func NewAddressService(repo domain.AddressRepository) AddressService {
	return &addressService{repo: repo}
}

func (s *addressService) Create(ctx context.Context, userID uuid.UUID, req domain.CreateAddressRequest) error {
	// Check if this is the first address
	count, err := s.repo.CountByUserID(ctx, userID)
	if err != nil {
		return err
	}

	isPrimary := req.IsPrimary
	if count == 0 {
		isPrimary = true // Force primary if first address
	}

	// If setting as primary, unset others first
	if isPrimary {
		if err := s.repo.UnsetPrimaryForUser(ctx, userID); err != nil {
			return err
		}
	}

	address := &domain.Address{
		UserID:        userID,
		RecipientName: req.RecipientName,
		PhoneNumber:   req.PhoneNumber,
		Street:        req.Street,
		City:          req.City,
		State:         req.State,
		ZipCode:       req.ZipCode,
		IsPrimary:     isPrimary,
	}

	return s.repo.Create(ctx, address)
}

func (s *addressService) GetMyAddresses(ctx context.Context, userID uuid.UUID) ([]domain.Address, error) {
	return s.repo.FindAllByUserID(ctx, userID)
}

func (s *addressService) Update(ctx context.Context, userID uuid.UUID, addressID uuid.UUID, req domain.UpdateAddressRequest) error {
	// Find existing address
	address, err := s.repo.FindByID(ctx, addressID)
	if err != nil {
		return err
	}

	// Check ownership
	if address.UserID != userID {
		return errors.New("unauthorized to update this address")
	}

	// If setting as primary, unset others
	if req.IsPrimary != nil && *req.IsPrimary {
		if err := s.repo.UnsetPrimaryForUser(ctx, userID); err != nil {
			return err
		}
		address.IsPrimary = true
	} else if req.IsPrimary != nil && !*req.IsPrimary {
		// Cannot unset primary directly via update if it's the only one (optional logic, skipping for simplicity)
		address.IsPrimary = false
	}

	// Update fields if provided
	if req.RecipientName != "" { address.RecipientName = req.RecipientName }
	if req.PhoneNumber != "" { address.PhoneNumber = req.PhoneNumber }
	if req.Street != "" { address.Street = req.Street }
	if req.City != "" { address.City = req.City }
	if req.State != "" { address.State = req.State }
	if req.ZipCode != "" { address.ZipCode = req.ZipCode }

	return s.repo.Update(ctx, address)
}

func (s *addressService) Delete(ctx context.Context, userID uuid.UUID, addressID uuid.UUID) error {
	// Find existing address
	address, err := s.repo.FindByID(ctx, addressID)
	if err != nil {
		return err
	}

	// Check ownership
	if address.UserID != userID {
		return errors.New("unauthorized to delete this address")
	}

	return s.repo.Delete(ctx, addressID)
}
