# [Defect Report] DB-001: Thiếu ràng buộc UNIQUE email và lệch Data Constraint bảng Users

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-001 |
| **Module** | Users |
| **Mức độ (Severity)** | Medium |
| **Loại lỗi (Type)** | Database Schema / Data Constraint |
| **Trạng thái (Status)** | ✔ **Fixed** |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 07/08/2026 |

---

### 1. Mô tả lỗi (Description)
* Tài liệu SRS chưa khai báo đầy đủ các ràng buộc `NOT NULL` và độ dài dữ liệu (`VARCHAR`) theo thiết kế thực tế.
* Model Sequelize của bảng `Users` chưa khai báo ràng buộc `UNIQUE` cho trường `email`, trong khi yêu cầu thiết kế và tài liệu SRS quy định mỗi địa chỉ email phải là duy nhất.

### 2. Nguyên nhân (Root Cause)
Trong quá trình cập nhật cơ sở dữ liệu, Model Sequelize chưa được đồng bộ đầy đủ với tài liệu thiết kế, dẫn đến thiếu ràng buộc `UNIQUE` đối với trường `email` và chưa cập nhật các ràng buộc dữ liệu theo SRS.

### 3. Ảnh hưởng (Impact)
* Có thể phát sinh nhiều tài khoản sử dụng cùng một địa chỉ email.
* Gây mất tính toàn vẹn dữ liệu và ảnh hưởng đến chức năng đăng nhập, xác thực hoặc khôi phục mật khẩu.
* Làm sai lệch giữa tài liệu SRS và cơ sở dữ liệu triển khai, gây khó khăn trong bảo trì và sinh Migration.

### 4. Giải pháp sửa đổi (Resolution)
* Bổ sung `unique: true` cho trường `email` trong Model Sequelize.
* Đồng bộ các ràng buộc `NOT NULL` và độ dài dữ liệu (`VARCHAR`) giữa Model Sequelize và tài liệu SRS.
* Cập nhật lại DBML và ERD để phản ánh đúng cấu trúc cơ sở dữ liệu sau khi chỉnh sửa.

### 5. Kết quả sau sửa đổi (Result)
* Trường `email` đã được bổ sung ràng buộc `UNIQUE`.
* Các trường `fullName`, `phone`, `username` và `password` đã được đồng bộ đầy đủ về `NOT NULL` và độ dài dữ liệu.
* Database Schema, DBML, ERD và tài liệu SRS đã được đồng bộ hoàn toàn với hệ thống.