# Project Context: Go-Rest-Api (Tokopedia Upgrade)

## 1. Project Overview
A professional E-Commerce platform aiming to replicate the core experience of Tokopedia (Indonesia's leading marketplace). The system is divided into a public **Storefront** (Buyer) and a secure **Dashboard** (Admin/Seller).

## 2. Key Objectives
*   **Modern UX**: Tokopedia-like "Unify" design system, responsive, high-performance.
*   **Robust Security**: HTTP-Only Cookies, RBAC, Secure Transaction Flow.
*   **Scalable Backend**: Go Fiber with Clean Architecture.
*   **Feature Parity**: Product Variants, Cart, Checkout, Order Status Tracking.

## Tech Stack
- **Languages**: Go, TypeScript/JavaScript
- **Frameworks**: 
  - Backend: **Fiber** (Go)
  - Frontend: **Next.js**
- **Architecture**: Modular Monolith or Clean Architecture layers (Handler -> Service -> Repository).

## Key Features
1. **User Authentication**: Register, Login (JWT).
2. **Product Catalog**: List, Search, Detail view.
3. **Cart Management**: Add/Remove items.
4. **Order Placement**: Simple checkout process.

## Folder Structure (Planned)

### Backend (`/backend` or root)
- `main.go`: Entry point.
- `/routes`: Route definitions.
- `/handlers`: HTTP Controllers.
- `/services`: Business logic.
- `/repositories`: DB access.
- `/models`: Struct definitions.

### Frontend (`/frontend`)
- `/pages` or `/app`: Next.js pages.
- `/components`: Reusable UI components.
- `/lib` or `/utils`: API clients, helpers.

## Conventions
- **Naming**: camelCase for JSON, PascalCase for Go structs.
- **Commits**: Conventional Commits (feat, fix, docs, etc.).
- **Code Style**: See [.docs/code_style.md](../.docs/code_style.md) for detailed guidelines.

