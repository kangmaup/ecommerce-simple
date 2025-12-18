# Tokopedia Standard Upgrade Roadmap

## 1. Overview
The goal is to elevate the current simple inventory system into a professional E-Commerce platform similar to Tokopedia's "Official Store" experience. This involves splitting the application into two distinct areas: **Storefront** (Public/Buyer) and **Dashboard** (Admin/Seller), improving the UI/UX to be information-dense yet clean, and hardening security.

## 2. User & System Flow (Revised)

### A. Roles & Permissions (RBAC)
*   **Admin/Seller**: Access to `/dashboard`. Can manage products, categories, view all orders, update order status.
*   **Buyer (User)**: Access to `/` (Home), `/search`, `/product/:slug`, `/cart`, `/profile`. Can browse, add to cart, checkout, view own order history.
*   **Guest**: Can browse and view products. Must login to buy.

### B. Core Flows
1.  **Browse & Discovery (Storefront)**
    *   **Homepage**: Hero Banners, Featured Categories, Flash Sale (Timer), Recommended Products.
    *   **Search & Filter**: Powerful search with filters (Price range, Category, Sort by).
    *   **Product Detail**: Image Gallery (zoom), Variant Selection (Color/Size), Stock Indicator (Tokopedia style "Sisa X"), Reviews (Placeholder), "Add to Cart" vs "Buy Now".

2.  **Transaction Flow**
    *   **Cart**: Bulk actions (Select/Delete), Price Summary.
    *   **Checkout**: Address Selection, Courier Selection (JNE/GoSend mock), Payment Method Selection.
    *   **Payment**: Simulated Payment Gateway (Success/Pending/Failed).
    *   **Order Tracking**: Detailed status timeline (Waiting Payment -> Processing -> Shipping -> Delivered -> Completed).

3.  **Admin Flow (Dashboard)**
    *   **Enhanced Dashboard**: Real-time sales charts, pending order alerts.
    *   **Order Management**: Process orders, input Resi (Tracking Number).

## 3. UI/UX Standards (Tokopedia Style)
*   **Design System**: "Unify" inspired.
    *   **Colors**: Green (`#42b549` - Tokopedia Main), White, Gray (`#f2f3f4` background).
    *   **Typography**: Open Sans or Inter. Reliable, readable.
    *   **Components**: Cards with shadows, sticky headers, bottom navigation (mobile), skeleton loaders (no spinning wheels if possible), toast notifications.
*   **Responsive**: Mobile-first priority.

## 4. Security & Architecture Hardening
*   **Authentication**:
    *   Switch to **HTTP-Only Cookies** for JWT (Prevent XSS token theft).
    *   Implement **Refresh Token** rotation (Better UI/UX for session persistence).
*   **Data Validation**: Strict server-side validation using `validator/v10`.
*   **Security Headers**: Helmet (Security headers) for Fiber and Next.js.
*   **Rate Limiting**: Prevent brute force on Login/Register.

## 5. Implementation Phases
1.  **Phase 1: Foundation Clean-up & Security** (Refactor Auth to Cookies, RBAC enforcement).
2.  **Phase 2: Storefront Implementation** (Home, Search, Product Detail).
3.  **Phase 3: Transaction System** (Cart, Checkout, Orders).
4.  **Phase 4: Dashboard Alignment** (Update Dashboard to manage new Order statuses).
