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

func (h *AddressHandler) GetMyAddresses(c *fiber.Ctx) error {
	user := c.Locals("user").(*utils.JWTClaims)

	addresses, err := h.service.GetMyAddresses(c.Context(), user.UserID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.JSON(fiber.Map{"data": addresses})
}

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
