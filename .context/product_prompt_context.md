# Product Management Context

## Objective
Implement the Product and Category modules based on the [.docs/product_management_brd_prd.md] specifications.

## Implementation Guidelines

### 1. Domain Models (`internal/domain`)
- **Category**: Struct with `ID` (UUID), `Name`, `Slug`.
- **Product**: Struct with `ID` (UUID), `Name`, `Slug`, `Description`, `Price` (float64 or decimal), `Stock` (int), `CategoryID` (UUID), `ImageURL`.
- **Relationships**: Product belongs to Category (`gorm:"foreignKey:CategoryID"`).
- **Hooks**: Use GORM `BeforeCreate` / `BeforeUpdate` to auto-generate Slugs from Names.

### 2. Validation
- Use explicit validation checks in the Service layer or validation tags.
- Price must be positive.
- Stock cannot be negative.

### 3. Architecture
- **Repository**:
    - `ProductRepository`: FindAll (with pagination/filter), FindByID, Create, Update, Delete.
    - `CategoryRepository`: FindAll, Create.
- **Service**:
    - Business logic for creating products (generating slugs, validating constraints).
- **Handler**:
    - `ProductHandler`: Parse query params for pagination (`page`, `limit`) and filters (`category_id`, `search`).

### 4. Admin Protection
- Endpoints modifying data (POST, PUT, DELETE) MUST be protected by JWT Authentication AND Role Check (Admin only).
- Public endpoints (GET) do not require auth.

## Reference Code Style
Follow the patterns established in `user_service.go` and `auth_handler.go`.
