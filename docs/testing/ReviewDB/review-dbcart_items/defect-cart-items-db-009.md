# [Defect Report] DB-009: Lệch Naming Convention và thiếu Data Constraint bảng Cart Items

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-009 |
| **Module** | Cart Items |
| **Mức độ (Severity)** | Medium |
| **Loại lỗi (Type)** | Database Schema / Data Type / Naming Consistency |
| **Trạng thái (Status)** | Fixed |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 08/08/2026 |

---

### 1. Mô tả lỗi (Description)
* Bảng `cart_items` trong SRS cũ sử dụng tên trường `unit_price` (`snake_case`), trong khi Backend sử dụng `unitPrice` (`camelCase`).
* Tài liệu SRS chưa xác định rõ kiểu dữ liệu và ràng buộc chi tiết của `unitPrice`.
* Database thực tế yêu cầu định dạng: `unitPrice DECIMAL(10,2) [NOT NULL]`.

### 2. Nguyên nhân (Root Cause)
Tài liệu SRS chưa được cập nhật kịp thời sau khi Backend thay đổi Naming Convention và bổ sung các ràng buộc dữ liệu thực tế.

### 3. Ảnh hưởng (Impact)
* Các API thao tác với giỏ hàng có thể truyền/nhận sai tên trường (`unit_price` thay vì `unitPrice`).
* Dữ liệu giá sản phẩm trong chi tiết giỏ hàng chưa được mô tả chính xác trong tài liệu.
* Có nguy cơ gây sai lệch khi sinh Migration hoặc triển khai mới Database.

### 4. Giải pháp sửa đổi (Resolution)
* Đổi tên trường: `unit_price` → `unitPrice`.
* Chuẩn hóa kiểu dữ liệu và ràng buộc: `unitPrice DECIMAL(10,2) [NOT NULL]`.
* Đồng bộ lại sơ đồ DBML, ERD và tài liệu API Design.

### 5. Kết quả sau sửa đổi (Result)
* Bảng `cart_items` trong SRS đã được đồng bộ hoàn toàn với Backend và Model Sequelize.

### 6. Kết quả kiểm tra lại (Retest)
| Nội dung kiểm tra | Kết quả |
| :--- | :---: |
| Trường `cart_id` hợp lệ | Đạt |
| Trường `product_id` hợp lệ | Đạt |
| Trường `quantity` hợp lệ | Đạt |
| Tên trường `unitPrice` chuẩn `camelCase` | Đạt |
| Kiểu dữ liệu `unitPrice` là `DECIMAL(10,2)` | Đạt |
| `unitPrice` có ràng buộc `NOT NULL` | Đạt |
| Trường `note` hợp lệ | Đạt |