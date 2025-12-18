# Product Requirements Document (PRD) - Address Management Module

## 1. Overview
The Address Management module allows users to maintain a persistent list of shipping addresses. It allows for multiple addresses per user and a single "Primary" address.

## 2. Status
- **Status**: Implemented
- **Phase**: 5 (Address Management)

## 3. Features
### 3.1 Manage Addresses
- **Endpoint**: `POST /api/addresses`
- **Description**: Add a new address.
- **Fields**: `recipient_name`, `phone_number`, `street`, `city`, `state`, `zip_code`.
- **Logic**: If this is the user's first address, `is_primary` is auto-set to true.

### 3.2 View Addresses
- **Endpoint**: `GET /api/addresses`
- **Description**: List all addresses for the logged-in user.
- **Sorting**: Primary address first, then by `created_at` descending.

### 3.3 Update Address
- **Endpoint**: `PUT /api/addresses/:id`
- **Description**: Update details or set as primary.
- **Logic**: If `is_primary` is set to true in the update, all other addresses for this user are updated to `is_primary = false`.

### 3.4 Delete Address
- **Endpoint**: `DELETE /api/addresses/:id`
- **Description**: Soft or hard delete address.

## 4. Data Models
### Address
| Field | Type | Constraint | Description |
|---|---|---|---|
| id | UUID | PK | Unique ID |
| user_id | UUID | FK | Owner |
| recipient_name | String | Not Null | Recipient's Name |
| phone_number | String | Not Null | Contact Number |
| street | String | Not Null | Street Address |
| city | String | Not Null | City |
| state | String | Not Null | Province/State |
| zip_code | String | Not Null | Postal Code |
| is_primary | Boolean | Default False | Is Default Address |

## 5. UI/UX Requirements
- **List View**: Card-based layout. Primary address highlighted.
- **Add/Edit**: Modal form.
- **Empty State**: Friendly illustration and "Add Address" CTA.
