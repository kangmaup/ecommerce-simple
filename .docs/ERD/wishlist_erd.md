```mermaid
erDiagram
    USERS ||--o{ WISHLISTS : "saves"
    PRODUCTS ||--o{ WISHLISTS : "is saved in"

    WISHLISTS {
        uuid id PK
        uuid user_id FK
        uuid product_id FK
        timestamp created_at
    }
```
