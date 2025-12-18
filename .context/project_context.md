# Project Context

## Project Goal
Build a simple e-commerce system consisting of a REST API backend and a server-side rendered frontend.

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

