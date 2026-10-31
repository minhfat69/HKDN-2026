# [Defect Report] DB-005: Bất đồng bộ cấu trúc bảng Reviews và quan hệ dữ liệu với Products

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-005 |
| **Module** | Reviews |
| **Mức độ (Severity)** | High |
| **Loại lỗi (Type)** | Database Schema / Data Consistency / Relationship |
| **Trạng thái (Status)** | ✔ **Fixed** |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 08/08/2026 |

---

### 1. Mô tả lỗi (Description)
* Tài liệu SRS cũ khai báo các trường: `user_id`, `product_id`, `rating`, `comment`, `created_at`.
* Database thực tế đang sử dụng các trường: `user_id`, `phone`, `dish_name`, `content`, `rating`, `created_at`, `updated_at`.
* SRS có trường `product_id` nhưng Backend không sử dụng.
* Backend bổ sung hai trường `phone` và `dish_name` nhưng tài liệu SRS chưa khai báo.
* SRS sử dụng tên trường `comment`, trong khi Backend sử dụng `content`.
* SRS chưa khai báo trường `updated_at`.
* Quan hệ `Ref: reviews.product_id > products.id` trong SRS/ERD cũ không còn tồn tại trong Database thực tế.

### 2. Nguyên nhân (Root Cause)
Trong quá trình phát triển chức năng đánh giá món ăn, cấu trúc bảng `reviews` đã được thay đổi. Backend chuyển từ việc liên kết trực tiếp bài review với `products.id` sang lưu trực tiếp thông tin món ăn thông qua trường `dish_name`. Tuy nhiên, tài liệu SRS, sơ đồ DBML và ERD chưa được cập nhật kịp thời theo cấu trúc mới của hệ thống.

### 3. Ảnh hưởng (Impact)
* SRS không phản ánh đúng cấu trúc bảng `reviews` đang được triển khai trên thực tế.
* Sơ đồ ERD chứa quan hệ `Reviews -> Products` thừa, không chính xác.
* API Review có nguy cơ sử dụng sai tên trường (`comment` thay vì `content`).
* Phát sinh lỗi khi Frontend gửi hoặc nhận dữ liệu đánh giá từ Backend.
* Gây khó khăn cho quá trình bảo trì và phát triển các chức năng liên quan đến phản hồi của khách hàng.

### 4. Giải pháp sửa đổi (Resolution)
* Loại bỏ trường `product_id` và xóa bỏ quan hệ `Ref: reviews.product_id > products.id` khỏi bảng `reviews`.
* Đồng bộ tên trường `comment` thành `content`.
* Bổ sung các trường `phone`, `dish_name` và `updated_at` vào tài liệu SRS và DBML.
* Cập nhật lại sơ đồ ERD, DBML và tài liệu API Design cho Module Reviews theo đúng cấu trúc thực tế.

### 5. Kết quả sau sửa đổi (Result)
* Cấu trúc bảng `reviews` trong tài liệu SRS đã được đồng bộ hoàn toàn với Model Sequelize.
* Loại bỏ triệt để quan hệ không tồn tại giữa `reviews` và `products` trên sơ đồ DBML/ERD.
* Thống nhất tên trường `content` giữa Database, API và giao diện Frontend.
* Bổ sung đầy đủ các trường `phone`, `dish_name` và `updated_at`.
* Các tài liệu SRS, DBML, ERD và API Design đã được cập nhật đồng bộ.