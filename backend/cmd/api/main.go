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
	"github.com/user/go-ecommerce/internal/handler/http/middleware"
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
	categoryRepo := repository.NewCategoryRepository(infrastructure.DB)
	productRepo := repository.NewProductRepository(infrastructure.DB)
	cartRepo := repository.NewCartRepository(infrastructure.DB)
	orderRepo := repository.NewOrderRepository(infrastructure.DB)
	addressRepo := repository.NewAddressRepository(infrastructure.DB)
	wishlistRepo := repository.NewWishlistRepository(infrastructure.DB)

	// Services
	userService := service.NewUserService(userRepo, cfg)
	categoryService := service.NewCategoryService(categoryRepo)
	productService := service.NewProductService(productRepo, categoryRepo)
	cartService := service.NewCartService(cartRepo, productRepo)
	orderService := service.NewOrderService(orderRepo, cartRepo, productRepo, infrastructure.DB)
	addressService := service.NewAddressService(addressRepo)
	wishlistService := service.NewWishlistService(wishlistRepo)

	// Handlers
	authHandler := handler.NewAuthHandler(userService, cfg)
	categoryHandler := handler.NewCategoryHandler(categoryService)
	productHandler := handler.NewProductHandler(productService)
	cartHandler := handler.NewCartHandler(cartService)
	orderHandler := handler.NewOrderHandler(orderService)
	addressHandler := handler.NewAddressHandler(addressService)
	wishlistHandler := handler.NewWishlistHandler(wishlistService)

	// Initialize Fiber
	app := fiber.New(fiber.Config{
		AppName: cfg.Server.AppName,
	})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000,http://localhost:3001",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

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
	auth.Post("/logout", authHandler.Logout)

	// Protected Routes (Require Auth)
	admin := api.Group("/admin", middleware.AuthMiddleware(cfg)) 
	admin.Get("/orders", orderHandler.GetAllOrders)

	// Category Routes
	categories := api.Group("/categories")
	categories.Get("/", categoryHandler.FindAll)
	categories.Get("/:id", categoryHandler.FindByID)
	categories.Post("/", middleware.AuthMiddleware(cfg), categoryHandler.Create)
	categories.Put("/:id", middleware.AuthMiddleware(cfg), categoryHandler.Update)
	categories.Delete("/:id", middleware.AuthMiddleware(cfg), categoryHandler.Delete)

	// Product Routes
	products := api.Group("/products")
	products.Get("/", productHandler.FindAll)
	products.Get("/:id", productHandler.FindByID)
	products.Get("/slug/:slug", productHandler.FindBySlug)
	products.Post("/", middleware.AuthMiddleware(cfg), productHandler.Create)
	products.Put("/:id", middleware.AuthMiddleware(cfg), productHandler.Update)
	products.Delete("/:id", middleware.AuthMiddleware(cfg), productHandler.Delete)

	// Cart Routes
	cart := api.Group("/cart", middleware.AuthMiddleware(cfg))
	cart.Get("/", cartHandler.GetCart)
	cart.Post("/", cartHandler.AddToCart)
	cart.Put("/items/:id", cartHandler.UpdateItem)
	cart.Delete("/items/:id", cartHandler.RemoveItem)

	// Order Routes
	orders := api.Group("/orders", middleware.AuthMiddleware(cfg))
	orders.Post("/checkout", orderHandler.Checkout)
	orders.Get("/", orderHandler.GetMyOrders)

	// Address Routes
	addresses := api.Group("/addresses", middleware.AuthMiddleware(cfg))
	addresses.Post("/", addressHandler.Create)
	addresses.Get("/", addressHandler.GetMyAddresses)
	addresses.Put("/:id", addressHandler.Update)
	addresses.Delete("/:id", addressHandler.Delete)

	// Wishlist Routes
	wishlist := api.Group("/wishlist", middleware.AuthMiddleware(cfg))
	wishlist.Post("/toggle", wishlistHandler.Toggle)
	wishlist.Get("/", wishlistHandler.GetMyWishlist)

	// Start Server
	log.Printf("Server starting on port %s", cfg.Server.Port)
	log.Fatal(app.Listen(":" + cfg.Server.Port))
}
