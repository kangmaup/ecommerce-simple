package handler

import (
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
	"github.com/user/go-ecommerce/internal/domain"
	"github.com/user/go-ecommerce/internal/service"
	"github.com/user/go-ecommerce/pkg/utils"
)

type AddressHandler struct {
	service service.AddressService
}

func NewAddressHandler(service service.AddressService) *AddressHandler {
	return &AddressHandler{service: service}
}

// Create godoc
// @Summary Create address
// @Description Create a new shipping address
// @Tags address
// @Accept json
// @Produce json
// @Param request body domain.CreateAddressRequest true "Create Address Request"
// @Success 201 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /addresses [post]
func (h *AddressHandler) Create(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)

	var req domain.CreateAddressRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": domain.ErrBadParamInput.Error()})
	}

	// Validate (Simple check)
	if req.RecipientName == "" || req.Street == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Recipient Name and Street are required"})
	}

	err := h.service.Create(c.Context(), user.UserID, req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"message": "Address created successfully"})
}

// GetMyAddresses godoc
// @Summary Get user addresses
// @Description Get all addresses for the current user
// @Tags address
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /addresses [get]
func (h *AddressHandler) GetMyAddresses(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)

	addresses, err := h.service.GetMyAddresses(c.Context(), user.UserID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": addresses})
}

// Update godoc
// @Summary Update address
// @Description Update an existing address by ID
// @Tags address
// @Accept json
// @Produce json
// @Param id path string true "Address ID"
// @Param request body domain.UpdateAddressRequest true "Update Address Request"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 403 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /addresses/{id} [put]
func (h *AddressHandler) Update(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)

	addressIDStr := c.Params("id")
	addressID, err := uuid.Parse(addressIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Address ID"})
	}

	var req domain.UpdateAddressRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": domain.ErrBadParamInput.Error()})
	}

	err = h.service.Update(c.Context(), user.UserID, addressID, req)
	if err != nil {
		if err.Error() == "unauthorized to update this address" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": err.Error()})
		}
		if err == domain.ErrNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Address not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Address updated successfully"})
}

// Delete godoc
// @Summary Delete address
// @Description Delete an address by ID
// @Tags address
// @Produce json
// @Param id path string true "Address ID"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} map[string]interface{}
// @Failure 403 {object} map[string]interface{}
// @Failure 404 {object} map[string]interface{}
// @Failure 500 {object} map[string]interface{}
// @Router /addresses/{id} [delete]
func (h *AddressHandler) Delete(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)

	addressIDStr := c.Params("id")
	addressID, err := uuid.Parse(addressIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid Address ID"})
	}

	err = h.service.Delete(c.Context(), user.UserID, addressID)
	if err != nil {
		if err.Error() == "unauthorized to delete this address" {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": err.Error()})
		}
		if err == domain.ErrNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Address not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"message": "Address deleted successfully"})
}
