# Simple E-Commerce System (Go Fiber + Next.js)

A full-stack e-commerce application built with **Go** (Fiber v2) for the backend and **Next.js 15** for the frontend.

## Architecture
- **Backend**: Go, Fiber, GORM, PostgreSQL, JWT Auth.
- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS, Zustand.
- **Database**: PostgreSQL.

## Prerequisites
- Go 1.23+
- Node.js 18+
- PostgreSQL

## Getting Started

### 1. Database Setup
Create a PostgreSQL database named `db-ecommerce` (or match what is in your `.env`).

### 2. Backend Setup
Navigate to the backend directory:
```bash
cd backend
```

Create a `.env` file (copy from example or use provided keys):
```env
PORT=8080
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=db-ecommerce
JWT_SECRET=your_secret_key
```

Run database migrations:
```bash
go run cmd/migrate/main.go
```

Start the server:
```bash
go run cmd/api/main.go
```
The API will run at `http://localhost:8080`.

### 3. Frontend Setup
Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The app will run at `http://localhost:3000`.

## Features
- **Authentication**: Register & Login (JWT).
- **Product Management**: CRUD for Products and Categories.
- **RBAC**: User roles (Admin/Customer).
- **Clean Architecture**: Modular code structure.

## Documentation
See the `.docs` folder for detailed documentation:
- [System Flow](.docs/system_flow.md)
- [Code Style](.docs/code_style.md)
- [Product BRD/PRD](.docs/product_management_brd_prd.md)
