package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/user/go-ecommerce/internal/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found or error loading it")
	}

	cfg := config.LoadConfig()

	// Connect to 'postgres' database to create new DB
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=postgres port=%s sslmode=disable TimeZone=Asia/Jakarta",
		cfg.Database.Host,
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Port,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to postgres setup db: %v", err)
	}

	// Check if DB exists
	var exists bool
	checkQuery := fmt.Sprintf("SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = '%s')", cfg.Database.Name)
	err = db.Raw(checkQuery).Scan(&exists).Error
	if err != nil {
		log.Fatalf("Failed to check db existence: %v", err)
	}

	if !exists {
		fmt.Printf("Database %s does not exist. Creating...\n", cfg.Database.Name)
		createStmt := fmt.Sprintf("CREATE DATABASE \"%s\"", cfg.Database.Name)
		if err := db.Exec(createStmt).Error; err != nil {
			log.Fatalf("Failed to create database: %v", err)
		}
		fmt.Println("Database created successfully.")
	} else {
		fmt.Println("Database already exists.")
	}
}
