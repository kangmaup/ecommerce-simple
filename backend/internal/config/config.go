package config

import (
	"os"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	Cookie   CookieConfig
}

type ServerConfig struct {
	Port    string
	AppName string
}

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
}

type JWTConfig struct {
	Secret string
	Expiry string
}
	
	type CookieConfig struct {
		Domain   string
		Secure   bool
		HTTPOnly bool
		SameSite string
	}

	func LoadConfig() *Config {
		return &Config{
			Server: ServerConfig{
				Port:    getEnv("PORT", "8080"),
				AppName: getEnv("APP_NAME", "Go Fiber App"),
			},
			Database: DatabaseConfig{
				Host:     getEnv("DB_HOST", "localhost"),
				Port:     getEnv("DB_PORT", "5432"),
				User:     getEnv("DB_USER", "postgres"),
				Password: getEnv("DB_PASSWORD", "postgres"),
				Name:     getEnv("DB_NAME", "go_ecommerce"),
			},
			JWT: JWTConfig{
				Secret: getEnv("JWT_SECRET", "secret"),
				Expiry: getEnv("JWT_EXPIRY", "24h"),
			},
			Cookie: CookieConfig{
				Domain:   getEnv("COOKIE_DOMAIN", ""),
				Secure:   getEnv("COOKIE_SECURE", "false") == "true",
				HTTPOnly: getEnv("COOKIE_HTTP_ONLY", "true") == "true",
				SameSite: getEnv("COOKIE_SAME_SITE", "Lax"),
			},
		}
	}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
