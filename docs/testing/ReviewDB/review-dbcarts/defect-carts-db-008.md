# [Defect Report] DB-008: Thiếu ràng buộc UNIQUE trên quan hệ 1-1 bảng Carts

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-008 |
| **Module** | Carts |
| **Mức độ (Severity)** | High |
| **Loại lỗi (Type)** | Database Constraint / Relationship |
| **Trạng thái (Status)** | Fixed |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 08/08/2026 |

---

### 1. Mô tả lỗi (Description)
* Trong SRS cũ, bảng `carts` quy định `user_id BIGINT [UNIQUE]`, đảm bảo mỗi User chỉ sở hữu một Cart.
* Trong DBML hiện tại, trường `user_id` chỉ khai báo `BIGINT` mà thiếu ràng buộc `[UNIQUE]`.
* Mặc dù Relationship vẫn được khai báo `Ref: carts.user_id - users.id` (quan hệ 1-1), nhưng việc thiếu `UNIQUE` trên cột `user_id` dẫn đến sự mâu thuẫn về mặt định nghĩa ràng buộc dữ liệu trong DBML.

### 2. Nguyên nhân (Root Cause)
Trong quá trình cập nhật tài liệu DBML, ràng buộc `UNIQUE` đối với trường `carts.user_id` đã bị bỏ sót.

### 3. Ảnh hưởng (Impact)
* Nếu Database triển khai thiếu ràng buộc `UNIQUE`, một User có thể khởi tạo nhiều giỏ hàng.
* Quan hệ 1-1 giữa Users và Carts không được đảm bảo ở mức độ cơ sở dữ liệu.
* Phát sinh nhiều giỏ hàng rác cho cùng một tài khoản, gây sai lệch logic nghiệp vụ khi đặt hàng.

### 4. Giải pháp sửa đổi (Resolution)
* Cập nhật khai báo DBML: `user_id BIGINT [UNIQUE]`.
* Giữ nguyên khai báo quan hệ: `Ref: carts.user_id - users.id`.
* Kiểm tra Model Sequelize để đảm bảo `user_id` có khai báo `unique: true`.

### 5. Kết quả sau sửa đổi (Result)
* Đảm bảo mỗi User chỉ sở hữu duy nhất một giỏ hàng (Cart).
* Quan hệ giữa Users và Carts được bảo toàn chuẩn thiết kế 1-1.
* Thống nhất hoàn toàn giữa tài liệu DBML và Model Sequelize.

### 6. Kết quả kiểm tra lại (Retest)
| Nội dung kiểm tra | Kết quả |
| :--- | :---: |
| Trường `carts.user_id` tồn tại | Đạt |
| Trường `carts.user_id` có ràng buộc `UNIQUE` | Đạt |
| Quan hệ User → Cart được duy trì 1-1 | Khớp |
| Chống trùng lặp giỏ hàng theo User | Đạt |
| DBML đồng bộ chính xác với Relationship | Khớp |