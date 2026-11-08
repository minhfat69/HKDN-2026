# Thiết kế Database — AppDatMon (HKDN-2026)

Sơ đồ ERD tổng thể, gồm 12 bảng gốc (theo SRS ban đầu) + 3 bảng đã code (Voucher, InventoryTransaction, RecipeItem) + 5 bảng mới đề xuất (Ingredient, InventoryBatch, Waitlist, Shift, VoidLog).

Chi tiết từng cột (kiểu dữ liệu, ý nghĩa, UC liên quan) xem file `Thiet_ke_Database_moi_AppDatMon.xlsx` đi kèm.

```mermaid
erDiagram
  USERS ||--o{ ORDERS : places
  USERS ||--o{ RESERVATIONS : books
  USERS ||--o| CARTS : has
  USERS ||--o{ REVIEWS : writes
  USERS ||--o{ NOTIFICATIONS : receives
  USERS ||--o{ SHIFTS : opens
  USERS ||--o{ VOID_LOGS : authorizes
  CATEGORIES ||--o{ PRODUCTS : contains
  PRODUCTS ||--o{ ORDER_ITEMS : "ordered as"
  PRODUCTS ||--o{ CART_ITEMS : "added as"
  PRODUCTS ||--o{ RECIPE_ITEMS : requires
  RESTAURANT_TABLES ||--o{ RESERVATIONS : "assigned to"
  RESTAURANT_TABLES ||--o{ ORDERS : serves
  RESTAURANT_TABLES ||--o{ WAITLIST : "seats (sau khi chờ)"
  RESERVATIONS ||--o{ ORDERS : generates
  ORDERS ||--o{ ORDER_ITEMS : contains
  ORDERS ||--|| PAYMENTS : "settled by"
  ORDERS }o--o| VOUCHERS : applies
  CARTS ||--o{ CART_ITEMS : contains
  INGREDIENTS ||--o{ INVENTORY_BATCHES : "stocked as"
  INGREDIENTS ||--o{ INVENTORY_TRANSACTIONS : "moved as"
  INGREDIENTS ||--o{ RECIPE_ITEMS : "used in"
  INVENTORY_BATCHES ||--o{ INVENTORY_TRANSACTIONS : "depleted via"
  ORDER_ITEMS ||--o{ VOID_LOGS : "voided as"

  USERS {
    bigint id PK
    string fullName
    string phone
    string role
    string membershipTier
    string pinCode
  }
  CATEGORIES {
    bigint id PK
    string name
  }
  PRODUCTS {
    bigint id PK
    bigint category_id FK
    string name
    decimal price
    boolean isAvailable
  }
  RESTAURANT_TABLES {
    bigint id PK
    int tableNumber
    string qrCode
    string status
  }
  RESERVATIONS {
    bigint id PK
    bigint user_id FK
    bigint table_id FK
    datetime reservationTime
    string status
  }
  ORDERS {
    bigint id PK
    bigint user_id FK
    bigint table_id FK
    bigint reservation_id FK
    bigint voucher_id FK
    string orderType
    string deliveryAddress
    decimal finalPrice
    int pointsUsed
    decimal vatAmount
    string status
    string paymentStatus
  }
  ORDER_ITEMS {
    bigint id PK
    bigint order_id FK
    bigint product_id FK
    int quantity
    string status
  }
  PAYMENTS {
    bigint id PK
    bigint order_id FK
    decimal amount
    string payment_method
    string transaction_id
    string status
  }
  CARTS {
    bigint id PK
    bigint user_id FK
    decimal totalPrice
  }
  CART_ITEMS {
    bigint id PK
    bigint cart_id FK
    bigint product_id FK
    int quantity
  }
  REVIEWS {
    bigint id PK
    bigint user_id FK
    string dish_name
    int rating
    string status
  }
  NOTIFICATIONS {
    bigint id PK
    bigint user_id FK
    string title
    string type
  }
  VOUCHERS {
    bigint id PK
    string code
    int discountPercent
    string status
  }
  INGREDIENTS {
    bigint id PK
    string name
    string unit
    decimal currentStock
  }
  INVENTORY_BATCHES {
    bigint id PK
    bigint ingredient_id FK
    string lotNumber
    date mfgDate
    date expDate
    decimal quantityRemaining
  }
  INVENTORY_TRANSACTIONS {
    bigint id PK
    bigint ingredient_id FK
    bigint batch_id FK
    string type
    decimal quantity
  }
  RECIPE_ITEMS {
    bigint id PK
    bigint product_id FK
    bigint ingredient_id FK
    decimal quantityNeeded
  }
  WAITLIST {
    bigint id PK
    bigint table_id FK
    string guestName
    string guestPhone
    int partySize
    string status
  }
  SHIFTS {
    bigint id PK
    bigint staff_id FK
    datetime openedAt
    datetime closedAt
    decimal openingCash
    decimal closingCash
    string status
  }
  VOID_LOGS {
    bigint id PK
    bigint order_item_id FK
    bigint authorizedBy FK
    string type
    string reason
  }
```

## Trạng thái triển khai

- ✅ Đã thiết kế & lên sơ đồ (file này + file Excel)
- ⏳ Chưa code vào repo — các bảng `Users`/`Orders`/`Reviews` cần sửa là file dùng chung cả nhóm, nên đợi xác nhận trước khi đụng vào
- ✅ `Voucher`, `InventoryTransaction`, `RecipeItem` đã có code thật trong `backend/src/models/`
