package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/user/go-ecommerce/internal/service"
	"github.com/user/go-ecommerce/pkg/utils"
)

type OrderHandler struct {
	service service.OrderService
}

func NewOrderHandler(service service.OrderService) *OrderHandler {
	return &OrderHandler{service: service}
}

// Checkout godoc
// @Summary Checkout cart
// @Description Create an order from the current cart
// @Tags orders
// @Produce json
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /orders/checkout [post]
func (h *OrderHandler) Checkout(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)
	userID := user.UserID

	order, err := h.service.Checkout(c.Context(), userID)
	if err != nil {
		if err.Error() == "cart is empty" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cart is empty"})
		}
		// Basic check for stock errors
		// In production, better error typing is needed
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Order created successfully",
		"data":    order,
	})
}

// GetMyOrders godoc
// @Summary Get user orders
// @Description Retrieve a list of the current user's orders
// @Tags orders
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /orders [get]
func (h *OrderHandler) GetMyOrders(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)
	userID := user.UserID

	orders, err := h.service.GetMyOrders(c.Context(), userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": orders})
}

// GetAllOrders godoc
// @Summary Get all orders
// @Description Retrieve a list of all orders (Admin only)
// @Tags orders
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /admin/orders [get]
func (h *OrderHandler) GetAllOrders(c *fiber.Ctx) error {
	orders, err := h.service.GetAllOrders(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": orders})
}
