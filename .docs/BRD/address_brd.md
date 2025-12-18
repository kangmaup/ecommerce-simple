# Business Requirements Document (BRD) - Address Management Module

## 1. Executive Summary
The Address Management module enables users to manage multiple shipping addresses, selecting a primary address for streamlined checkout. This feature enhances user convenience and supports the e-commerce fulfillment process.

## 2. Business Objectives
- **Improve User Experience**: Allow users to save and manage multiple addresses to reduce entry errors during checkout.
- **Streamline Checkout**: Pre-select the primary address to speed up the purchase flow.
- **Data Accuracy**: Ensure address data is structured validation for shipping calculations.

## 3. Scope
### In Scope
- Create, Read, Update, Delete (CRUD) operations for user addresses.
- Setting a "Primary" address.
- Limiting access so users can only manage their own addresses.
- Admin view (future scope, currently just user-facing).

### Out of Scope
- Real-time address validation (Google Maps API integration) - *Future Phase*.
- International address formats (currently focused on ID format).

## 4. User Stories
- **As a User**, I want to add a new address so I can ship my orders there.
- **As a User**, I want to view my list of saved addresses to choose the correct one.
- **As a User**, I want to edit an address if I made a mistake or moved.
- **As a User**, I want to delete an old address to keep my list clean.
- **As a User**, I want to set a primary address that is auto-selected during checkout.

## 5. Functional Requirements
- **AR-01**: User can add an address with: Recipient Name, Phone, Street, City, State, Zip Code.
- **AR-02**: System must enforce at least one primary address if addresses exist (first one created is default).
- **AR-03**: Setting a new primary address must automatically unset the previous one.
- **AR-04**: Users cannot delete or update addresses belonging to others.

## 6. Non-Functional Requirements
- **Security**: Endpoint protected by JWT Authentication (`AuthMiddleware`).
- **Performance**: Address retrieval should be under 200ms.
