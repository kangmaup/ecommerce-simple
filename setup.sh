#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Starting Project Setup for macOS/Linux...${NC}"

# Function to check and install via brew
check_and_install() {
    CMD=$1
    PKG=$2
    NAME=$3

    if command -v $CMD &> /dev/null; then
        echo -e "${GREEN}✅ $NAME is already installed.${NC}"
    else
        echo -e "${YELLOW}⚠️ $NAME is not installed. Attempting to install via Homebrew...${NC}"
        if ! command -v brew &> /dev/null; then
            echo -e "${RED}❌ Homebrew is not installed. Please install it first: https://brew.sh/${NC}"
            exit 1
        fi
        brew install $PKG
        if command -v $CMD &> /dev/null; then
             echo -e "${GREEN}✅ $NAME installed successfully.${NC}"
        else
             echo -e "${RED}❌ Failed to install $NAME.${NC}"
             exit 1
        fi
    fi
}

# 1. Prerequisites Check
check_and_install "go" "go" "Go"
check_and_install "node" "node" "Node.js"

# Check for Yarn
if command -v yarn &> /dev/null; then
    echo -e "${GREEN}✅ Yarn is already installed.${NC}"
else
    echo -e "${YELLOW}⚠️ Yarn is not installed. Installing via npm...${NC}"
    npm install -g yarn
fi

# 2. Backend Setup
echo -e "\n${CYAN}📦 Setting up Backend...${NC}"
cd backend || exit

# Copy .env
if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}📄 Created .env from .env.example${NC}"
    else
        echo "PORT=8080
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=ecommerce_db
DB_PORT=5432" > .env
        echo -e "${GREEN}📄 Created default .env${NC}"
    fi
else
    echo -e "${GREEN}✅ .env already exists${NC}"
fi

# Go Deps and Swag
echo "⬇️ Installing Go dependencies..."
go mod tidy
echo "⬇️ Installing Swag CLI..."
go install github.com/swaggo/swag/cmd/swag@latest
echo "🔄 Generating Swagger Docs..."
# Ensure go bin is in path for this session
export PATH=$PATH:$(go env GOPATH)/bin
swag init -g cmd/api/main.go --output ./docs

# Database Prompt
read -p "❓ Do you want to run database migrations/seeding? (Make sure Postgres is running) [y/N] " -r
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🐘 Running Seeder..."
    go run cmd/seed/main.go
fi

cd ..

# 3. Frontend Setup
echo -e "\n${CYAN}🎨 Setting up Frontend...${NC}"
cd frontend || exit
echo "⬇️ Installing Node dependencies..."
yarn install

cd ..

echo -e "\n${GREEN}✨ Setup Complete! ✨${NC}"
echo "To start the project:"
echo "  1. Backend: cd backend && go run cmd/api/main.go"
echo "  2. Frontend: cd frontend && yarn dev"
