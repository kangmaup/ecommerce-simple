package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
	"github.com/user/go-ecommerce/internal/service"
	"github.com/user/go-ecommerce/pkg/utils"
)

type CartHandler struct {
	service service.CartService
}

func NewCartHandler(service service.CartService) *CartHandler {
	return &CartHandler{service: service}
}

func (h *CartHandler) GetCart(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)
	// UserID in JWTClaims is already uuid.UUID, no need to parse
	userID := user.UserID

	cart, err := h.service.GetCart(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(cart)
}

func (h *CartHandler) AddToCart(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)
	userID := user.UserID

	var req domain.AddToCartRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": domain.ErrBadParamInput.Error()})
	}

	if err := h.service.AddToCart(c.Context(), userID, req); err != nil {
		if err.Error() == "insufficient stock" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Insufficient stock"})
		}
		if err == domain.ErrNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Product not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Item added to cart"})
}

func (h *CartHandler) UpdateItem(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)
	userID := user.UserID

	itemIDStr := c.Params("id")
	itemID, err := uuid.Parse(itemIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid UUID"})
	}

	var req domain.UpdateCartItemRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": domain.ErrBadParamInput.Error()})
	}

	if err := h.service.UpdateItem(c.Context(), userID, itemID, req); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Cart item updated"})
}

func (h *CartHandler) RemoveItem(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)
	userID := user.UserID

	itemIDStr := c.Params("id")
	itemID, err := uuid.Parse(itemIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid UUID"})
	}

	if err := h.service.RemoveItem(c.Context(), userID, itemID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Item removed from cart"})
}
