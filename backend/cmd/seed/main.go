package main

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/user/go-ecommerce/internal/config"
	"github.com/user/go-ecommerce/internal/domain"
	"github.com/user/go-ecommerce/internal/infrastructure"
	"github.com/user/go-ecommerce/pkg/utils"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading it")
	}

	cfg := config.LoadConfig()
	infrastructure.ConnectDB(cfg)

	db := infrastructure.DB
	ctx := context.Background()

	log.Println("Seeding Database...")

	// 1. Seed Users
	seedUsers(db, ctx)

	// 2. Seed Categories & Products
	seedCategoriesAndProducts(db, ctx)

	log.Println("Seeding Completed Successfully!")
}

func seedUsers(db *gorm.DB, ctx context.Context) {
	// 1. Ensure Roles Exist
	roles := []string{"admin", "user"}
	roleMap := make(map[string]uuid.UUID)

	for _, rName := range roles {
		var role domain.Role
		err := db.WithContext(ctx).Where("name = ?", rName).First(&role).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				role = domain.Role{
					ID:   uuid.New(),
					Name: rName,
				}
				if err := db.WithContext(ctx).Create(&role).Error; err != nil {
					log.Printf("Failed to create role %s: %v", rName, err)
					continue
				}
				log.Printf("Created role: %s", rName)
			} else {
				log.Printf("Error checking role %s: %v", rName, err)
			}
		}
		roleMap[rName] = role.ID
	}

	// 2. Seed Users
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("password123"), bcrypt.DefaultCost)

	adminRoleID := roleMap["admin"]
	userRoleID := roleMap["user"]

	users := []struct {
		Name   string
		Email  string
		RoleID uuid.UUID
	}{
		{
			Name:   "Admin Toko",
			Email:  "admin@tokopedia.com",
			RoleID: adminRoleID,
		},
		{
			Name:   "Buyer User",
			Email:  "buyer@gmail.com",
			RoleID: userRoleID,
		},
	}

	for _, u := range users {
		var existing domain.User
		if err := db.WithContext(ctx).Where("email = ?", u.Email).First(&existing).Error; err == nil {
			log.Printf("User %s already exists, skipping...", u.Email)
			continue
		}

		user := domain.User{
			ID:       uuid.New(),
			Name:     u.Name,
			Email:    u.Email,
			Password: string(hashedPassword),
			RoleID:   &u.RoleID,
		}

		if err := db.WithContext(ctx).Create(&user).Error; err != nil {
			log.Printf("Failed to create user %s: %v", u.Email, err)
		} else {
			log.Printf("Created user: %s", u.Email)
		}
	}
}

func seedCategoriesAndProducts(db *gorm.DB, ctx context.Context) {
	categories := []string{"Elektronik", "Fashion Pria", "Fashion Wanita", "Rumah Tangga", "Kesehatan", "Hobi & Mainan"}
	
	for _, catName := range categories {
		catSlug := utils.MakeSlug(catName)
		var category domain.Category
		
		// Find or Create Category
		err := db.WithContext(ctx).Where("slug = ?", catSlug).First(&category).Error
		if err != nil {
			if err == gorm.ErrRecordNotFound {
				category = domain.Category{
					ID:   uuid.New(),
					Name: catName,
					Slug: catSlug,
				}
				if err := db.WithContext(ctx).Create(&category).Error; err != nil {
					log.Printf("Failed to create category %s: %v", catName, err)
					continue
				}
				log.Printf("Created category: %s", catName)
			} else {
				log.Printf("Error finding category %s: %v", catName, err)
				continue
			}
		}

		// Seed Products for this Category
		seedProductsForCategory(db, ctx, category.ID, catName)
	}
}

func seedProductsForCategory(db *gorm.DB, ctx context.Context, catID uuid.UUID, catName string) {
	// Generate some dummy products based on category
	products := getDummyProducts(catName)

	for _, p := range products {
		slug := utils.MakeSlug(p.Name)
		var existing domain.Product
		if err := db.WithContext(ctx).Where("slug = ?", slug).First(&existing).Error; err == nil {
			continue // Product exists
		}

		p.ID = uuid.New()
		p.CategoryID = catID
		p.Slug = slug
		p.CreatedAt = time.Now()
		p.UpdatedAt = time.Now()

		if err := db.WithContext(ctx).Create(&p).Error; err != nil {
			log.Printf("Failed to create product %s: %v", p.Name, err)
		} else {
			log.Printf("Created product: %s", p.Name)
		}
	}
}

func getDummyProducts(catName string) []domain.Product {
	baseMap := map[string][]domain.Product{
		"Elektronik": {
			{Name: "iPhone 15 Pro Max 256GB", Description: "iPhone terbaru dengan chip A17 Pro.", Price: 24999000, Stock: 10, ImageURL: "https://images.unsplash.com/photo-1696446702378-b11823eb574e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
			{Name: "MacBook Air M2 13 Inch", Description: "Laptop tipis dan ringan bertenaga M2.", Price: 18999000, Stock: 5, ImageURL: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
			{Name: "Sony WH-1000XM5", Description: "Headphone noise cancelling terbaik.", Price: 5999000, Stock: 20, ImageURL: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
		},
		"Fashion Pria": {
			{Name: "Kemeja Flannel Uniqlo", Description: "Kemeja nyaman untuk sehari-hari.", Price: 399000, Stock: 50, ImageURL: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
			{Name: "Levi's 501 Original Jeans", Description: "Celana jeans klasik legendaris.", Price: 1299000, Stock: 30, ImageURL: "https://images.unsplash.com/photo-1542272617-08f086303294?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
		},
		"Rumah Tangga": {
			{Name: "Dyson V12 Detect Slim", Description: "Vacuum cleaner tanpa kabel.", Price: 12499000, Stock: 8, ImageURL: "https://images.unsplash.com/photo-1558317374-a3545eca46f2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
			{Name: "Philips Air Fryer XL", Description: "Masak sehat tanpa minyak.", Price: 2500000, Stock: 15, ImageURL: "https://images.unsplash.com/photo-1626159950798-502a93175440?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"},
		},
		// For other categories, just generic items
	}

	if items, ok := baseMap[catName]; ok {
		return items
	}

	// Default/Fallback items for other categories
	return []domain.Product{
		{Name: fmt.Sprintf("Produk %s 1", catName), Description: "Deskripsi produk dummy.", Price: float64(rand.Intn(1000000) + 50000), Stock: 100, ImageURL: "https://placehold.co/600x400?text=Product+Image"},
		{Name: fmt.Sprintf("Produk %s 2", catName), Description: "Deskripsi produk dummy.", Price: float64(rand.Intn(1000000) + 50000), Stock: 100, ImageURL: "https://placehold.co/600x400?text=Product+Image"},
	}
}
