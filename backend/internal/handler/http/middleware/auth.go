package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/user/go-ecommerce/internal/config"
	"github.com/user/go-ecommerce/internal/domain"
	"github.com/user/go-ecommerce/pkg/utils"
)

func AuthMiddleware(cfg *config.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var tokenString string

		// 1. Try Cookie
		cookieToken := c.Cookies("token")
		if cookieToken != "" {
			tokenString = cookieToken
		}

		// 2. Fallback to Header (if no cookie)
		if tokenString == "" {
			authHeader := c.Get("Authorization")
			if authHeader != "" {
				parts := strings.Split(authHeader, " ")
				if len(parts) == 2 && parts[0] == "Bearer" {
					tokenString = parts[1]
				}
			}
		}

		if tokenString == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": domain.ErrUnauthorized.Error()})
		}
		claims, err := utils.ValidateToken(tokenString, cfg)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid token"})
		}

		c.Locals("user", claims)
		return c.Next()
	}
}
