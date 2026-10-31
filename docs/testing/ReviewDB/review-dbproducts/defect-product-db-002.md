# [Defect Report] DB-002: Bất đồng bộ cấu trúc bảng Products giữa SRS và Model Sequelize

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-002 |
| **Module** | Products |
| **Mức độ (Severity)** | High |
| **Loại lỗi (Type)** | Database Schema / Data Consistency |
| **Trạng thái (Status)** | ✔ **Fixed** |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 07/08/2026 |

---

### 1. Mô tả lỗi (Description)
Trong quá trình đối chiếu giữa tài liệu SRS và Model Sequelize của hệ thống, phát hiện bảng `products` chưa đồng bộ với cơ sở dữ liệu thực tế:
* Tài liệu SRS sử dụng trường `sold_count`, trong khi Backend đã thay thế bằng trường `stock`.
* Tên trường `is_available` trong SRS không thống nhất với `isAvailable` trong Model Sequelize.
* Chưa khai báo đầy đủ ràng buộc `NOT NULL` và kiểu dữ liệu `DECIMAL(10,2)` theo thiết kế thực tế.

### 2. Nguyên nhân (Root Cause)
Trong quá trình phát triển hệ thống, cấu trúc bảng `products` đã được thay đổi để phù hợp với yêu cầu quản lý số lượng món ăn trong kho. Tuy nhiên, tài liệu SRS chưa được cập nhật kịp thời theo các thay đổi của Model Sequelize.

### 3. Ảnh hưởng (Impact)
* Tài liệu SRS, DBML và ERD không phản ánh đúng cấu trúc cơ sở dữ liệu thực tế.
* Có thể dẫn đến sai lệch khi xây dựng Migration hoặc triển khai cơ sở dữ liệu từ tài liệu.
* API và các chức năng quản lý sản phẩm có nguy cơ sử dụng sai tên trường, gây lỗi khi tích hợp giữa Backend và Frontend.

### 4. Giải pháp sửa đổi (Resolution)
* Thay thế trường `sold_count` bằng `stock` trong tài liệu SRS.
* Đồng bộ tên trường `is_available` thành `isAvailable` theo Model Sequelize.
* Cập nhật kiểu dữ liệu `price` thành `DECIMAL(10,2)`.
* Bổ sung các ràng buộc `NOT NULL` cho các trường bắt buộc như `category_id`, `name` và `price`.
* Cập nhật lại DBML, ERD và API Design theo cấu trúc mới.

### 5. Kết quả sau sửa đổi (Result)
* Bảng `products` đã được đồng bộ hoàn toàn với Model Sequelize.
* Tài liệu SRS, DBML và ERD phản ánh đúng cấu trúc cơ sở dữ liệu của hệ thống.
* Các API liên quan đến quản lý sản phẩm hoạt động thống nhất với cơ sở dữ liệu thực tế.