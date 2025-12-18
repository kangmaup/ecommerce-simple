# Business Requirements Document (BRD) - Wishlist Module

## 1. Executive Summary
The Wishlist module allows users to save products they are interested in but not yet ready to purchase. This feature increases user engagement and retention by providing a personalized space for future purchases.

## 2. Business Objectives
- **Retention**: Encourage users to return to the site to view saved items.
- **Data Insight**: Understand user preferences and demand for potential marketing (future).
- **Convenience**: Allow users to easily move items from wishlist to cart.

## 3. Scope
### In Scope
- Add item to Wishlist.
- Remove item from Wishlist.
- View Wishlist.
- Toggle Heart Icon on Product Cards.

### Out of Scope
- Shared Wishlists (Public/Shareable links).
- Notifications (Price drops, etc.).

## 4. User Stories
- **As a User**, I want to tap a heart icon on a product to save it.
- **As a User**, I want to see a list of all my saved items.
- **As a User**, I want to easily remove items I'm no longer interested in.

## 5. Functional Requirements
- **WL-01**: Wishlist is private to the user.
- **WL-02**: Adding a duplicate item should ideally toggle it off (Remove) or handle idempotency.
- **WL-03**: Users must be logged in to use Wishlist.

## 6. Non-Functional Requirements
- **Performance**: Toggle action should be optimistic (instant UI feedback).
