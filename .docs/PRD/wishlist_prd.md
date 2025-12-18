# Product Requirements Document (PRD) - Wishlist Module

## 1. Overview
Manages the user's collection of favorite products.

## 2. Status
- **Status**: Planned
- **Phase**: 6

## 3. Features
### 3.1 Toggle Wishlist
- **Endpoint**: `POST /api/wishlist/toggle`
- **Body**: `{ "product_id": "uuid" }`
- **Logic**: If exists, remove. If not exists, add. Returns new status (`added` or `removed`).

### 3.2 View Wishlist
- **Endpoint**: `GET /api/wishlist`
- **Response**: List of Products.

### 3.3 Remove Item
- **Endpoint**: `DELETE /api/wishlist/:id` (Optional if toggle handles it, but explicit delete is good for list view).

## 4. Data Models
### Wishlist
| Field | Type | Description |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK |
| product_id | UUID | FK |
| created_at | Timestamp | Added date |

## 5. UI/UX Requirements
- **Heart Icon**: on Product Card (Outline = Not Saved, Red/Filled = Saved).
- **Wishlist Page**: Grid view of products with "Remove" button or Heart icon.
- **Navbar**: Heart icon linking to /wishlist.
