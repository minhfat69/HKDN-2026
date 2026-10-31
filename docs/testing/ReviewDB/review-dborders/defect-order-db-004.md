# [Defect Report] DB-004: Bất đồng bộ cấu trúc bảng Orders giữa SRS và Model Sequelize

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-004 |
| **Module** | Orders |
| **Mức độ (Severity)** | High |
| **Loại lỗi (Type)** | Database Schema / Business Rule / Data Consistency |
| **Trạng thái (Status)** | ✔ **Fixed** |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 08/08/2026 |

---

### 1. Mô tả lỗi (Description)
Trong quá trình đối chiếu giữa tài liệu SRS và Model Sequelize của hệ thống, phát hiện bảng `orders` chưa được cập nhật đầy đủ theo cấu trúc Database thực tế:
* Tài liệu SRS sử dụng `total_price`, trong khi Backend sử dụng `totalPrice`.
* Tài liệu SRS sử dụng `discount_amount`, trong khi Backend sử dụng `discountAmount`.
* Tài liệu SRS sử dụng `final_price`, trong khi Backend sử dụng `finalPrice`.
* Tài liệu SRS sử dụng `payment_status`, trong khi Backend sử dụng `paymentStatus`.
* SRS chưa khai báo trường `paymentMethod`.
* SRS chưa khai báo trường `isPointsAdded`.
* Các trường tiền tệ trong SRS chưa chỉ rõ định dạng `DECIMAL(10,2)`.
* Một số trường bắt buộc trong Backend chưa được thể hiện đầy đủ ràng buộc `NOT NULL` trong SRS.

### 2. Nguyên nhân (Root Cause)
Trong quá trình phát triển chức năng đặt món và thanh toán, Backend đã bổ sung:
* Phương thức thanh toán trực tiếp trên hóa đơn / đơn hàng.
* Cơ chế xác định đơn hàng đã được cộng điểm thưởng tích lũy hay chưa.

Đồng thời, cách đặt tên thuộc tính trong Model Sequelize được chuyển sang chuẩn `camelCase`, nhưng tài liệu SRS vẫn giữ cấu trúc `snake_case` cũ và chưa được cập nhật đồng bộ.

### 3. Ảnh hưởng (Impact)
* SRS và Database thực tế không thống nhất về tên và cấu trúc trường dữ liệu.
* Gây nhầm lẫn khi phát triển, thiết kế hoặc kiểm thử các API liên quan đến Order.
* Có nguy cơ xử lý sai thông tin phương thức thanh toán của đơn hàng.
* Dễ phát sinh sự cố cộng điểm thưởng nhiều lần cho cùng một đơn hàng nếu không kiểm soát chặt chẽ thông qua `isPointsAdded`.
* DBML và ERD không phản ánh chính xác cơ sở dữ liệu thực tế.

### 4. Giải pháp sửa đổi (Resolution)
Cập nhật bảng `orders` trong tài liệu SRS và DBML:
* Đồng bộ chuẩn tên các trường: `totalPrice`, `discountAmount`, `finalPrice`, `paymentStatus`.
* Bổ sung trường `paymentMethod ENUM('CASH', 'TRANSFER')`.
* Bổ sung trường `isPointsAdded BOOLEAN [DEFAULT: false]`.
* Chuẩn hóa kiểu dữ liệu tiền tệ thành `DECIMAL(10,2)`.
* Bổ sung ràng buộc `NOT NULL` cho các trường bắt buộc (`totalPrice`, `finalPrice`,...).
* Đồng bộ lại ERD và cập nhật API Design cho Order để phản ánh đúng `paymentMethod` và `isPointsAdded`.

### 5. Kết quả sau sửa đổi (Result)
* Bảng `orders` trong tài liệu SRS đã được đồng bộ hoàn toàn với Model Sequelize.
* Thông tin phương thức thanh toán của đơn hàng được thể hiện đầy đủ.
* Trạng thái cộng điểm thưởng của đơn hàng được quản lý chính xác thông qua `isPointsAdded`.
* Các trường dữ liệu tiền tệ đã được chuẩn hóa thống nhất về `DECIMAL(10,2)`.
* Các tài liệu SRS, DBML, ERD và API Design đã được cập nhật đồng nhất.