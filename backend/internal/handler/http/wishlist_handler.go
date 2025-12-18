package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/user/go-ecommerce/internal/domain"
	"github.com/user/go-ecommerce/pkg/utils"
)

type WishlistHandler struct {
	service domain.WishlistService
}

func NewWishlistHandler(service domain.WishlistService) *WishlistHandler {
	return &WishlistHandler{service: service}
}

func (h *WishlistHandler) Toggle(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)

	var req domain.ToggleWishlistRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": domain.ErrBadParamInput.Error()})
	}

	action, err := h.service.ToggleWishlist(c.Context(), user.UserID, req.ProductID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Success", "action": action})
}

func (h *WishlistHandler) GetMyWishlist(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)

	wishlists, err := h.service.GetMyWishlist(c.Context(), user.UserID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": wishlists})
}
