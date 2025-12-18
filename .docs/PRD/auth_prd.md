# Product Requirements Document (PRD) - Authentication & User Module

## 1. Overview
Manages User Identity, Authentication sessions (JWT), and Authorization (Roles).

## 2. Status
- **Status**: Implemented
- **Phase**: 1

## 3. Features
### 3.1 Registration
- **Endpoint**: `POST /api/auth/register`
- **Fields**: `name`, `email`, `password`.
- **Logic**: Checks for duplicate email. Hashes password. Assigns default "User" role.

### 3.2 Login
- **Endpoint**: `POST /api/auth/login`
- **Fields**: `email`, `password`.
- **Logic**: Verifies hash. Returns JWT token. Notifies frontend of User Role.

### 3.3 Authorization (Middleware)
- **Component**: `AuthMiddleware`
- **Logic**: Intercepts requests, parses JWT, injects User context into handler. Rejects invalid tokens (401).

## 4. Data Models
### User
| Field | Type | Description |
|---|---|---|
| id | UUID | PK |
| name | String | Full Name |
| email | String | Unique, Indexed |
| password | String | Bcrypt Hash |
| role_id | UUID | FK |

### Role
| Field | Type | Description |
|---|---|---|
| id | UUID | PK |
| name | String | e.g. "admin", "user" |

## 5. UI/UX Requirements
- **Auth Forms**: Login and Register pages.
- **Feedback**: Clear error messages for valid/invalid credentials.
- **Persistence**: Auto-login via stored token/cookie.
