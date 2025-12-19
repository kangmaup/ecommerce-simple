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

// GetCart godoc
// @Summary Get user cart
// @Description Retrieve the current user's shopping cart
// @Tags cart
// @Produce json
// @Success 200 {object} domain.Cart
// @Failure 500 {object} map[string]interface{}
// @Router /cart [get]
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

// AddToCart godoc
// @Summary Add item to cart
// @Description Add a product to the user's cart
// @Tags cart
// @Accept json
// @Produce json
// @Param request body domain.AddToCartRequest true "Add To Cart Request"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /cart [post]
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

// UpdateItem godoc
// @Summary Update cart item
// @Description Update quantity of an item in the cart
// @Tags cart
// @Accept json
// @Produce json
// @Param id path string true "Item ID"
// @Param request body domain.UpdateCartItemRequest true "Update Cart Item Request"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /cart/items/{id} [put]
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

// RemoveItem godoc
// @Summary Remove item from cart
// @Description Remove an item from the cart by ID
// @Tags cart
// @Produce json
// @Param id path string true "Item ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /cart/items/{id} [delete]
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
