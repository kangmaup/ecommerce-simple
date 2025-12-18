# Business Requirements Document (BRD) - Authentication & User Module

## 1. Executive Summary
The Authentication module secures the application, managing user identities and access control. It implements Role-Based Access Control (RBAC) to distinguish between standard Customer users and Administrators.

## 2. Business Objectives
- **Security**: Protect user data and administrative functions.
- **Identity**: Maintain unique user profiles for order history and address management.
- **Compliance**: Ensure secure password storage (hashing).

## 3. Scope
### In Scope
- user Registration (Sign Up).
- User Login (Sign In) with JWT.
- User Logout.
- Role Management (Admin vs User).
- Profile Management (Basic Info).

### Out of Scope
- Social Login (Google/Facebook) - *Future Phase*.
- Password Reset via Email - *Future Phase*.
- Multi-Factor Authentication (MFA).

## 4. User Stories
- **As a User**, I want to register an account to save my data.
- **As a User**, I want to log in securely.
- **As an Admin**, I want to have exclusive access to product management features.

## 5. Functional Requirements
- **AU-01**: Passwords must be hashed (Bcrypt) before storage.
- **AU-02**: Access tokens (JWT) must be issued upon successful login.
- **AU-03**: Protected routes must verify valid JWT in headers or cookies.
- **AU-04**: RBAC must deny non-admins from modifying catalog data.

## 6. Non-Functional Requirements
- **Security**: JWT tokens should have an expiration time (e.g., 24h).
