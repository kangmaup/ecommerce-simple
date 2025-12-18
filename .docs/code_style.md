# Code Style & Engineering Standards

## Philosophy
We adhere to **Clean Code** principles, focusing on readability, maintainability, and scalability. Code should be "Simple, not clever."

---

## 1. Backend: Go (Golang)

### Architecture: Clean Architecture / Hexagonal
We separate concerns into distinct layers. Dependencies point **inward**.
- **Domain (Models)**: Core business entities. No external dependencies.
- **Repository (Ports)**: Interfaces for data persistence.
- **Service (Use Cases)**: Business logic. Depends on Repository interfaces.
- **Handler (Adapters)**: HTTP transport (Fiber). Depends on Service interfaces.

### Style Guide
- **Follow Standard Go Layout**: `internal/` for private application code, `pkg/` for library code.
- **Linter**: Use `golangci-lint` with strict settings.
- **Formatting**: `gofmt` or `goimports` is non-negotiable.

### Best Practices
- **Error Handling**: 
    - Never ignore errors. 
    - Use wrapping: `fmt.Errorf("failed to get user: %w", err)`.
    - Avoid `panic` in production code.
- **Dependency Injection**: 
    - Explicitly pass dependencies via Struct constructors (`NewUserService(repo UserRepository)`).
- **Naming**:
    - `MixedCaps` or `mixedCaps` (camelCase).
    - Interfaces named `Reader`, `Writer` (method+er) or `UserRepository`.
    - Variable names should be short but descriptive (`ctx`, `err`, `u` for user in small scope).
- **Concurrency**:
    - Use `errgroup` for managing multiple goroutines.
    - specialized channels handling.

---

## 2. Frontend: Next.js (TypeScript)

### Architecture
- **Feature-First / Page-First**: Group related components/hooks/utils by feature if possible.
- **Server vs Client**: Default to Server Components. Use `'use client'` only when interactivity (state/effects) is needed.

### Style Guide
- **TypeScript**: `strict: true`. No `any` types. Define interfaces for all Props and API responses.
- **Linter**: `eslint-config-next` + `prettier`.
- **Naming**:
    - Components: `PascalCase.tsx`.
    - Utilities/Hooks: `camelCase.ts`.
    - Constants: `SCREAMING_SNAKE_CASE`.

### Best Practices
- **Components**:
    - Keep them small (Single Responsibility).
    - Use **Atomic Design** principles loosely (Atoms, Molecules, Organisms).
- **State Management**:
    - Prefer Server State (React Query / SWR / Server Actions) over global client state.
    - Use `Zustand` if global client state is strictly necessary.
- **Styling (Tailwind CSS)**:
    - Use utility classes.
    - Avoid `@apply` unless extracting a highly reusable component pattern (and even then, components are preferred).
    - Use `clsx` or `tailwind-merge` for dynamic classes.
- **Performance**:
    - Use `next/image` for image optimization.
    - Lazy load heavy components (`next/dynamic`).

---

## 3. General "Clean Code" Rules

### SOLID Principles
- **S**: Single Responsibility Principle (Classes/Functions do one thing).
- **O**: Open/Closed Principle (Open for extension, closed for modification).
- **L**: Liskov Substitution Principle.
- **I**: Interface Segregation (Small interfaces > Big interfaces).
- **D**: Dependency Inversion (Depend on abstractions/interfaces, not details).

### Git & Workflow
- **Conventional Commits**: `feat: add login endpoint`, `fix: resolve cart issue`.
- **Pull Requests**: Small, focused PRs.
