package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/config"
	"github.com/user/go-ecommerce/internal/domain"
	"github.com/user/go-ecommerce/pkg/utils"
)

type userService struct {
	userRepo domain.UserRepository
	config   *config.Config
}

func NewUserService(userRepo domain.UserRepository, cfg *config.Config) domain.UserService {
	return &userService{
		userRepo: userRepo,
		config:   cfg,
	}
}

func (s *userService) Register(ctx context.Context, name, email, password string) error {
	// Check if user exists
	existingUser, _ := s.userRepo.GetByEmail(ctx, email)
	if existingUser != nil {
		return domain.ErrConflict
	}

	// Hash Password
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return domain.ErrInternalServerError
	}

	user := &domain.User{
		Name:     name,
		Email:    email,
		Password: hashedPassword,
		// RoleID will be 0/Nil by default, should ideally set to a default "Customer" role
        // For now, we will assume UUID.Nil or handle Role assignment separately/later
	}

	return s.userRepo.Create(ctx, user)
}

func (s *userService) Login(ctx context.Context, email, password string) (string, error) {
	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		if err == domain.ErrNotFound {
			return "", domain.ErrUnauthorized // Don't reveal user existence
		}
		return "", err
	}

	if !utils.CheckPasswordHash(password, user.Password) {
		return "", domain.ErrUnauthorized
	}

	// Generate JWT
	roleID := uuid.Nil
	if user.RoleID != nil {
		roleID = *user.RoleID
	}
	token, err := utils.GenerateToken(user.ID, roleID, s.config)
	if err != nil {
		return "", domain.ErrInternalServerError
	}

	return token, nil
}
