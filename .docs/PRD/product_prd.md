# Product Requirements Document (PRD) - Product Catalog Module

## 1. Overview
Manages the core entity of the e-commerce system: The Products and their Categories.

## 2. Status
- **Status**: Implemented
- **Phase**: 2

## 3. Features
### 3.1 Category Management
- **Endpoints**: `/api/categories` (CRUD)
- **Fields**: `name`, `slug`, `image_url` (for icons/backgrounds).

### 3.2 Product Management
- **Endpoints**: `/api/products` (CRUD)
- **Public Access**: `GET` endpoints are public.
- **Protected Access**: `POST`, `PUT`, `DELETE` require Admin Role.
- **Slug Lookup**: `GET /api/products/slug/:slug` for frontend routing.

## 4. Data Models
### Category
| Field | Type | Description |
|---|---|---|
| id | UUID | PK |
| name | String | Visual Name |
| slug | String | Unique URL identifier |

### Product
| Field | Type | Description |
|---|---|---|
| id | UUID | PK |
| category_id | UUID | FK |
| name | String | Product Name |
| slug | String | Unique URL identifier |
| description | Text | Html/Markdown desc |
| price | Decimal | Selling Price |
| stock | Int | Inventory Count |
| image_url | String | Main Image |

## 5. UI/UX Requirements
- **Storefront**: Grid layout of products.
- **Categories**: Horizontal scroll or sidebar filter.
- **Detail Page**: Large image, prominent "Add to Cart" button.
