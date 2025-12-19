# Check for Administrator privileges
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Warning "This script requires Administrator privileges to install software via winget."
    Write-Warning "Please run PowerShell as Administrator."
    # Optional: logic to self-elevate, but keeping it simple for now
}

# Function to check and install a command
function Check-And-Install {
    param (
        [string]$Command,
        [string]$PackageId,
        [string]$Name
    )

    if (Get-Command $Command -ErrorAction SilentlyContinue) {
        Write-Host "✅ $Name is already installed." -ForegroundColor Green
    } else {
        Write-Host "⚠️ $Name is not installed. Attempting to install via winget..." -ForegroundColor Yellow
        winget install --id $PackageId -e --source winget
        
        # Reload env path references might be needed if winget updates PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        if (Get-Command $Command -ErrorAction SilentlyContinue) {
             Write-Host "✅ $Name installed successfully." -ForegroundColor Green
        } else {
             Write-Error "❌ Failed to install $Name. Please install it manually."
             exit 1
        }
    }
}

Write-Host "🚀 Starting Project Setup..." -ForegroundColor Cyan

# 1. Prerequisites Check
Check-And-Install -Command "go" -PackageId "GoLang.Go" -Name "Go"
Check-And-Install -Command "node" -PackageId "OpenJS.NodeJS" -Name "Node.js"

# Check for Yarn
if (Get-Command "yarn" -ErrorAction SilentlyContinue) {
    Write-Host "✅ Yarn is already installed." -ForegroundColor Green
} else {
    Write-Host "⚠️ Yarn is not installed. Installing via npm..." -ForegroundColor Yellow
    npm install -g yarn
    if (Get-Command "yarn" -ErrorAction SilentlyContinue) {
        Write-Host "✅ Yarn installed successfully." -ForegroundColor Green
    } else {
        Write-Error "❌ Failed to install Yarn."
        exit 1
    }
}

# 2. Backend Setup
Write-Host "`n📦 Setting up Backend..." -ForegroundColor Cyan
Set-Location "backend"

# Copy .env if missing
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "📄 Created .env from .env.example" -ForegroundColor Green
    } else {
        New-Item -Path ".env" -ItemType File -Value "PORT=8080`nDB_HOST=localhost`nDB_USER=postgres`nDB_PASSWORD=postgres`nDB_NAME=ecommerce_db`nDB_PORT=5432"
        Write-Host "📄 Created default .env" -ForegroundColor Green
    }
} else {
    Write-Host "✅ .env already exists" -ForegroundColor Gray
}

# Go Deps and Swag
Write-Host "⬇️ Installing Go dependencies..."
go mod tidy
Write-Host "⬇️ Installing Swag CLI..."
go install github.com/swaggo/swag/cmd/swag@latest
Write-Host "🔄 Generating Swagger Docs..."
swag init -g cmd/api/main.go --output ./docs

# Database Prompt
$response = Read-Host "`n❓ Do you want to run database migrations/seeding? (Make sure Postgres is running) [y/N]"
if ($response -eq 'y') {
    Write-Host "🐘 Running Seeder..."
    go run cmd/seed/main.go
}

Set-Location ..

# 3. Frontend Setup
Write-Host "`n🎨 Setting up Frontend..." -ForegroundColor Cyan
Set-Location "frontend"
Write-Host "⬇️ Installing Node dependencies..."
yarn install

Set-Location ..

Write-Host "`n✨ Setup Complete! ✨" -ForegroundColor Green
Write-Host "To start the project:"
Write-Host "  1. Backend: cd backend; go run cmd/api/main.go"
Write-Host "  2. Frontend: cd frontend; yarn dev"
