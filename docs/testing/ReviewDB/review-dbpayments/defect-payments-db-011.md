# [Defect Report] DB-011: Lệch Naming Convention và Data Type bảng Payments

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-011 |
| **Module** | Payments |
| **Mức độ (Severity)** | High |
| **Loại lỗi (Type)** | Database Schema / Relationship / Payment Data Consistency |
| **Trạng thái (Status)** | Fixed |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 08/08/2026 |

---

### 1. Mô tả lỗi (Description)
Đối chiếu bảng `payments`, phát hiện bất đồng bộ giữa SRS cũ và Database thực tế:
* Lệch Naming Convention: `payment_method` → `paymentMethod`, `transaction_code` → `transactionCode`, `paid_at` → `paidAt`.
* Kiểu dữ liệu và ràng buộc chưa chi tiết:
  * `amount` chưa chỉ rõ `DECIMAL(10,2)` và chưa có `NOT NULL`.
  * `transactionCode` chưa xác định độ dài `VARCHAR(255)`.
  * `paymentMethod` chưa có ràng buộc `NOT NULL`.
* Khai báo quan hệ trong DBML `Ref: payments.order_id - orders.id` (1-1) cần kiểm tra đảm bảo tính nhất quán nếu mỗi Order chỉ tương ứng một Payment.

### 2. Nguyên nhân (Root Cause)
Model Sequelize ở Backend đã bổ sung các ràng buộc dữ liệu cụ thể nhưng tài liệu SRS chưa được cập nhật đồng bộ.

### 3. Ảnh hưởng (Impact)
* Mất tính thống nhất giữa tài liệu SRS và Backend.
* Dễ phát sinh sai lệch khi thiết kế API thanh toán và xử lý kết quả từ cổng thanh toán.
* Nguy cơ lưu trữ sai lệch thông tin số tiền giao dịch.

### 4. Giải pháp sửa đổi (Resolution)
* Đổi tên trường sang `camelCase`: `paymentMethod`, `transactionCode`, `paidAt`.
* Cập nhật ràng buộc bảng `payments`:
  * `amount DECIMAL(10,2) NOT NULL`
  * `paymentMethod ENUM('CASH', 'VNPAY', 'MOMO', 'BANKING') NOT NULL`
  * `transactionCode VARCHAR(255)`
  * `status ENUM('PENDING', 'SUCCESS', 'FAILED') DEFAULT 'PENDING'`
  * `paidAt TIMESTAMP`
  * `created_at TIMESTAMP`
* Rà soát đảm bảo quan hệ giữa Payment và Order chính xác theo thiết kế hệ thống.

### 5. Kết quả sau sửa đổi (Result)
* Cấu trúc bảng `payments` đã được đồng bộ hoàn toàn với Backend.
* Thông tin tiền giao dịch và các phương thức thanh toán được chuẩn hóa rõ ràng.

### 6. Kết quả kiểm tra lại (Retest)
| Nội dung kiểm tra | Kết quả |
| :--- | :---: |
| Kiểu dữ liệu `amount` là `DECIMAL(10,2)` | Đạt |
| `amount` có ràng buộc `NOT NULL` | Đạt |
| Tên trường `paymentMethod` chuẩn `camelCase` | Đạt |
| Giá trị Enum của `paymentMethod` đầy đủ | Đạt |
| Trường `transactionCode` là `VARCHAR(255)` | Đạt |
| Trường `status` hợp lệ | Đạt |
| Trường `paidAt` chuẩn `camelCase` | Đạt |
| Quan hệ Payment → Order hợp lệ | Khớp |
| Tài liệu SRS đồng bộ với Backend | Khớp |