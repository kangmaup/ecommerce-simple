# Business Requirements Document (BRD) - Order & Cart Module

## 1. Executive Summary
The Order & Cart module facilitates the core e-commerce transaction flow. It enables users to browse products, add them to a temporary holding area (cart), and finalize purchases (orders) with stock deduction.

## 2. Business Objectives
- **Conversion**: Provide a frictionless adding-to-cart and checkout experience.
- **Inventory Management**: Ensure stock is reserved/deducted correctly upon checkout to prevent overselling.
- **Record Keeping**: Maintain detailed history of customer orders for tracking and support.

## 3. Scope
### In Scope
- **Cart**: Add, Update (Qty), Remove, View, Clear.
- **Checkout**: Convert Cart items to Order, Deduct Stock, Clear Cart.
- **Order Management**: View Order History (User), View All Orders (Admin), Update Status (Admin).

### Out of Scope
- Payment Gateway Integration (Phase 6).
- Shipping Cost Calculation (currently flat/free).
- Returns & Refunds logic.

## 4. User Stories
- **As a User**, I want to add products to my cart so I can buy them later.
- **As a User**, I want to adjust quantities in my cart.
- **As a User**, I want to checkout and create an order.
- **As a User**, I want to see my past orders and their status.
- **As an Admin**, I want to view all orders to manage fulfillment.

## 5. Functional Requirements
- **OC-01**: Cart is unique per user (One-to-One).
- **OC-02**: Adding a duplicate product to cart increments quantity, not a new row.
- **OC-03**: Checkout must validate stock availability before creation.
- **OC-04**: Checkout must be transactional (Atomic: Create Order -> Deduct Stock -> Clear Cart).
- **OC-05**: Users can only see their own orders; Admins can see all.

## 6. Non-Functional Requirements
- **Data Integrity**: Stock count must be accurate (ACID transactions required).
