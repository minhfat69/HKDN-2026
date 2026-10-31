# [Defect Report] DB-010: Bất đồng bộ Naming Convention và kiểu dữ liệu bảng Order Items

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-010 |
| **Module** | Order Items |
| **Mức độ (Severity)** | Medium |
| **Loại lỗi (Type)** | Database Schema / Data Type / Naming Consistency |
| **Trạng thái (Status)** | Fixed |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 08/08/2026 |

---

### 1. Mô tả lỗi (Description)
Bảng `order_items` trong tài liệu SRS chưa đồng bộ với Database thực tế:
* SRS cũ sử dụng `unit_price` và `total_price` (`snake_case`).
* Database thực tế sử dụng `unitPrice` và `totalPrice` (`camelCase`).
* Kiểu dữ liệu và ràng buộc tiền tệ trong SRS chưa chỉ rõ: `DECIMAL(10,2) [NOT NULL]`.

### 2. Nguyên nhân (Root Cause)
Tài liệu SRS vẫn giữ cấu trúc cũ trong khi Model Sequelize ở Backend đã được tái cấu trúc theo Naming Convention mới.

### 3. Ảnh hưởng (Impact)
* Gây không thống nhất giữa tài liệu thiết kế và hệ thống Backend.
* Dễ phát sinh lỗi khi thiết kế hoặc tích hợp các API liên quan đến chi tiết đơn hàng.
* Có thể gây sai lệch khi tính toán giá món ăn và tổng tiền đơn hàng.

### 4. Giải pháp sửa đổi (Resolution)
* Đồng bộ tên trường: `unit_price` → `unitPrice`, `total_price` → `totalPrice`.
* Chuẩn hóa kiểu dữ liệu tiền tệ thành `DECIMAL(10,2)`.
* Bổ sung ràng buộc `NOT NULL` cho hai trường `unitPrice` và `totalPrice`.
* Cập nhật sơ đồ DBML và ERD.

### 5. Kết quả sau sửa đổi (Result)
* Bảng `order_items` đã được đồng bộ chuẩn hóa:
  * `unitPrice DECIMAL(10,2) [NOT NULL]`
  * `totalPrice DECIMAL(10,2) [NOT NULL]`

### 6. Kết quả kiểm tra lại (Retest)
| Nội dung kiểm tra | Kết quả |
| :--- | :---: |
| Trường `order_id` hợp lệ | Đạt |
| Trường `product_id` hợp lệ | Đạt |
| Trường `quantity` hợp lệ | Đạt |
| Tên trường `unitPrice` chuẩn `camelCase` | Đạt |
| Tên trường `totalPrice` chuẩn `camelCase` | Đạt |
| Trường `status` hợp lệ | Đạt |
| Giá trị Enum `Order Item Status` chính xác | Đạt |
| SRS đồng bộ hoàn toàn với Backend | Khớp |