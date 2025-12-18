# Product Requirements Document (PRD) - Order & Cart Module

## 1. Overview
This module handles the shopping cart session and the order processing lifecycle.

## 2. Status
- **Status**: Implemented (Basic Checkout)
- **Phase**: 3 & 4

## 3. Features
### 3.1 Cart Management
- **Endpoints**:
  - `GET /api/cart`: Retrieve current user's cart.
  - `POST /api/cart`: Add item (requires `product_id`, `quantity`).
  - `PUT /api/cart/items/:id`: Update item quantity.
  - `DELETE /api/cart/items/:id`: Remove item.
- **Logic**: 
  - Validates stock > 0 before adding.
  - Merges quantity if item exists.

### 3.2 Checkout
- **Endpoint**: `POST /api/orders/checkout`
- **Description**: Converts cart to order.
- **Logic**:
  1. Start DB Transaction.
  2. For each item: Check stock >= qty.
  3. Create Order & OrderItems.
  4. Deduct Product Stock.
  5. Clear Cart.
  6. Commit.

### 3.3 Order Management
- **Endpoints**:
  - `GET /api/orders`: User's order history.
  - `GET /api/admin/orders`: Admin's view of all orders.
- **Status Enum**: `pending`, `paid`, `shipped`, `delivered`, `cancelled`.

## 4. Data Models
### Cart
| Field | Type | Description |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | Unique FK to User |

### CartItem
| Field | Type | Description |
|---|---|---|
| id | UUID | PK |
| cart_id | UUID | FK |
| product_id | UUID | FK |
| quantity | Int | > 0 |

### Order
| Field | Type | Description |
|---|---|---|
| id | UUID | PK |
| user_id | UUID | FK |
| total_amount | Decimal | Sum of items |
| status | String | Order Interaction Status |

### OrderItem
| Field | Type | Description |
|---|---|---|
| id | UUID | PK |
| order_id | UUID | FK |
| product_id | UUID | FK |
| quantity | Int | Snapshot of qty |
| price | Decimal | Snapshot of price at time of purchase |

## 5. UI/UX Requirements
- **Cart**: Dynamic quantity updates, remove button, summary calculation.
- **Checkout**: Button initiates instant checkout (mocks payment).
- **History**: List of orders with status badges.
