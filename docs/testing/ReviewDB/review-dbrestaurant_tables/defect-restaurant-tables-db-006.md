# [Defect Report] DB-007: Bất đồng bộ Naming Convention và ràng buộc NOT NULL bảng Restaurant Tables

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-007 |
| **Module** | Restaurant Tables |
| **Mức độ (Severity)** | Medium |
| **Loại lỗi (Type)** | Database Schema / Data Constraint / Naming Consistency |
| **Trạng thái (Status)** | Fixed |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 08/08/2026 |

---

### 1. Mô tả lỗi (Description)
Bảng `restaurant_tables` trong SRS chưa đồng bộ hoàn toàn với Database thực tế:
* SRS cũ sử dụng `table_number` và `qr_code` (`snake_case`), trong khi Backend sử dụng `tableNumber` và `qrCode` (`camelCase`).
* SRS chưa khai báo ràng buộc `NOT NULL` cho `tableNumber`.
* SRS chưa khai báo ràng buộc `NOT NULL` cho `qrCode`.
* SRS chưa thể hiện đầy đủ quy tắc dữ liệu của các trường bắt buộc.

### 2. Nguyên nhân (Root Cause)
Backend sử dụng Naming Convention theo Model Sequelize (`camelCase`) nhưng tài liệu SRS vẫn giữ nguyên tên trường của phiên bản Database thiết kế trước đó.

### 3. Ảnh hưởng (Impact)
* Không đồng bộ tên trường giữa tài liệu thiết kế và Backend.
* Có thể gây nhầm lẫn khi thiết kế các API liên quan đến quản lý bàn ăn.
* Có nguy cơ sử dụng sai tên thuộc tính khi Frontend tích hợp API.

### 4. Giải pháp sửa đổi (Resolution)
* Đồng bộ tên trường: `table_number` → `tableNumber`, `qr_code` → `qrCode`.
* Bổ sung ràng buộc `NOT NULL` cho hai trường `tableNumber` và `qrCode`.
* Cập nhật sơ đồ ERD, DBML và tài liệu API Design.

### 5. Kết quả sau sửa đổi (Result)
* Bảng `restaurant_tables` trong tài liệu phản ánh đúng cấu trúc Backend:
  * `tableNumber INTEGER [UNIQUE, NOT NULL]`
  * `qrCode TEXT [NOT NULL]`

### 6. Kết quả kiểm tra lại (Retest)
| Nội dung kiểm tra | Kết quả |
| :--- | :---: |
| Tên trường `tableNumber` chuẩn `camelCase` | Đạt |
| `tableNumber` có ràng buộc `UNIQUE` | Đạt |
| `tableNumber` có ràng buộc `NOT NULL` | Đạt |
| Tên trường `qrCode` chuẩn `camelCase` | Đạt |
| `qrCode` có ràng buộc `NOT NULL` | Đạt |
| SRS đồng bộ hoàn toàn với Backend | Khớp |
| DBML đồng bộ với Model Sequelize | Khớp |