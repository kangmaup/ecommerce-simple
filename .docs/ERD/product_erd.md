```mermaid
erDiagram
    CATEGORIES ||--o{ PRODUCTS : "contains"
    
    CATEGORIES {
        uuid id PK
        string name
        string slug
    }

    PRODUCTS {
        uuid id PK
        uuid category_id FK
        string name
        string slug
        text description
        decimal price
        int stock
        string image_url
    }
```
