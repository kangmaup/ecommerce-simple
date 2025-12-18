package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/user/go-ecommerce/internal/config"
	"github.com/user/go-ecommerce/internal/domain"
	"github.com/user/go-ecommerce/internal/infrastructure"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading it")
	}

	cfg := config.LoadConfig()
	infrastructure.ConnectDB(cfg)

	fmt.Println("Running Migrations...")
	err := infrastructure.DB.AutoMigrate(&domain.User{}, &domain.Role{}, &domain.Permission{})
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	fmt.Println("Migrations executed successfully")
}
