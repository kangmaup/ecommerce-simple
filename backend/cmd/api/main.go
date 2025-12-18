package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/joho/godotenv"
	"github.com/user/go-ecommerce/internal/config"
	handler "github.com/user/go-ecommerce/internal/handler/http"
	"github.com/user/go-ecommerce/internal/infrastructure"
	"github.com/user/go-ecommerce/internal/repository"
	"github.com/user/go-ecommerce/internal/service"
)

func main() {
	// Load .env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading it")
	}

	cfg := config.LoadConfig()
	
	// Database Connection
	infrastructure.ConnectDB(cfg)

	// Repositories
	userRepo := repository.NewUserRepository(infrastructure.DB)

	// Services
	userService := service.NewUserService(userRepo, cfg)

	// Handlers
	authHandler := handler.NewAuthHandler(userService)

	// Initialize Fiber
	app := fiber.New(fiber.Config{
		AppName: cfg.Server.AppName,
	})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New())

	// Routes
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":  "success",
			"message": "Server is running",
			"app":     cfg.Server.AppName,
		})
	})

	api := app.Group("/api")
	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)

	// Start Server
	log.Printf("Server starting on port %s", cfg.Server.Port)
	log.Fatal(app.Listen(":" + cfg.Server.Port))
}
