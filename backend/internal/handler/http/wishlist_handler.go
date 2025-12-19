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

// Toggle godoc
// @Summary Toggle wishlist
// @Description Add or remove an item from the wishlist
// @Tags wishlist
// @Accept json
// @Produce json
// @Param request body domain.ToggleWishlistRequest true "Toggle Wishlist Request"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /wishlist/toggle [post]
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

// GetMyWishlist godoc
// @Summary Get user wishlist
// @Description Retrieve the current user's wishlist items
// @Tags wishlist
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /wishlist [get]
func (h *WishlistHandler) GetMyWishlist(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)

	wishlists, err := h.service.GetMyWishlist(c.Context(), user.UserID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": wishlists})
}
