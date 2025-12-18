# Product Management - BRD & PRD

## 1. Business Requirement Document (BRD)

### Goal
Enable the e-commerce platform to manage and display products effectively. Admins need tools to maintain the catalog, while customers need an easy way to browse and find items.

### User Stories
- **As an Admin**, I want to add, edit, and delete products so that the catalog is up-to-date.
- **As an Admin**, I want to categorize products to organize the catalog.
- **As a Customer**, I want to view a list of products with images and prices.
- **As a Customer**, I want to filter products by category and search by name.
- **As a Customer**, I want to view detailed information about a specific product.

---

## 2. Product Requirement Document (PRD)

### Functional Requirements

#### A. Category Management (Admin Only)
- **Create Category**: Name, Slug (auto-generated).
- **List Categories**: View all available categories.
- **Update/Delete**: Modify or remove categories.

#### B. Product Management (Admin Only)
- **Create Product**:
    - Fields: Name, Description, Price, Stock, CategoryID, ImageURL.
    - Validation: Price > 0, Stock >= 0.
- **Edit Product**: Update details, adjust stock/price.
- **Delete Product**: Soft delete preferred (to keep order history).

#### C. Product Browsing (Public)
- **List Products**:
    - Pagination (e.g., 10 per page).
    - Sorting (Newest, Price Low-High).
    - Filtering (by Category).
- **Search**: By product name.
- **Product Detail**: Show full description, stock status.

### Data Model

#### Category
| Field | Type | Constraint |
|---|---|---|
| ID | UUID | PK |
| Name | String | Unique, Not Null |
| Slug | String | Unique, Index |

#### Product
| Field | Type | Constraint |
|---|---|---|
| ID | UUID | PK |
| Name | String | Not Null, Index |
| Slug | String | Unique, Index |
| Description | Text | |
| Price | Decimal | Not Null, > 0 |
| Stock | Int | Not Null, >= 0 |
| CategoryID | UUID | FK -> Category |
| ImageURL | String | |

### API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/categories` | Admin | Create Category |
| GET | `/api/categories` | Public | List Categories |
| GET | `/api/products` | Public | List/Search Products |
| GET | `/api/products/:id` | Public | Get Product Detail |
| POST | `/api/products` | Admin | Create Product |
| PUT | `/api/products/:id` | Admin | Update Product |
| DELETE | `/api/products/:id` | Admin | Delete Product |
