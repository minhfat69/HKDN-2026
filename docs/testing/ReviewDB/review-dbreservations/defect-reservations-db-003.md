# [Defect Report] DB-003: Bất đồng bộ cấu trúc bảng Reservations giữa SRS và Model Sequelize

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-003 |
| **Module** | Reservations |
| **Mức độ (Severity)** | High |
| **Loại lỗi (Type)** | Database Schema / Business Rule / Data Consistency |
| **Trạng thái (Status)** | ✔ **Fixed** |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 08/08/2026 |

---

### 1. Mô tả lỗi (Description)
Đối chiếu giữa tài liệu SRS và Model Sequelize của hệ thống, phát hiện cấu trúc bảng `reservations` chưa đồng bộ:
* Tài liệu SRS chưa khai báo trường `guestName`.
* Tài liệu SRS chưa khai báo trường `guestPhone`.
* SRS sử dụng `reservation_time`, trong khi Model Sequelize sử dụng `reservationTime`.
* SRS sử dụng `number_of_guests`, trong khi Model Sequelize sử dụng `numberOfGuests`.
* SRS chưa có trường `updated_at`.
* Enum `status` trong SRS chỉ bao gồm: `'PENDING'`, `'CONFIRMED'`, `'CHECKED_IN'`, `'CANCELLED'`, `'EXPIRED'`. Trong khi Backend đã mở rộng bổ sung hai trạng thái: `'ARRIVED'` và `'COMPLETED'`.

### 2. Nguyên nhân (Root Cause)
Trong quá trình phát triển chức năng đặt bàn, Backend đã bổ sung thông tin khách đặt bàn và mở rộng trạng thái xử lý quy trình đặt bàn. Tuy nhiên, các thay đổi này chưa được cập nhật đầy đủ vào tài liệu SRS và sơ đồ DBML.

### 3. Ảnh hưởng (Impact)
* Tài liệu SRS không phản ánh đầy đủ dữ liệu mà hệ thống thực tế đang quản lý.
* Có thể gây sai lệch khi thiết kế các API liên quan đến đặt bàn.
* Việc thiếu `guestName` và `guestPhone` có thể khiến hệ thống không lưu vết đầy đủ thông tin người đại diện đặt bàn.
* Việc thiếu `'ARRIVED'` và `'COMPLETED'` khiến tài liệu không mô tả chính xác và đầy đủ vòng đời xử lý của một đơn đặt bàn (`reservation`).
* ERD và DBML không đồng bộ với cơ sở dữ liệu triển khai thực tế.

### 4. Giải pháp sửa đổi (Resolution)
* Cập nhật bảng `reservations` trong tài liệu SRS và DBML:
  * Bổ sung trường `guestName VARCHAR NOT NULL`.
  * Bổ sung trường `guestPhone VARCHAR NOT NULL`.
  * Đồng bộ chuẩn tên trường `reservationTime`.
  * Đồng bộ chuẩn tên trường `numberOfGuests`.
  * Bổ sung trường `updated_at TIMESTAMP`.
  * Cập nhật danh sách Enum `status` đầy đủ 7 trạng thái: `'PENDING'`, `'CONFIRMED'`, `'ARRIVED'`, `'CHECKED_IN'`, `'COMPLETED'`, `'CANCELLED'`, `'EXPIRED'`.
* Đồng bộ các thay đổi trên sang ERD và kiểm tra lại API Design của chức năng đặt bàn.

### 5. Kết quả sau sửa đổi (Result)
* Cấu trúc bảng `reservations` đã được đồng bộ hoàn toàn với Model Sequelize.
* Đảm bảo hệ thống lưu trữ đầy đủ thông tin khách hàng đặt bàn.
* Các trạng thái của phiếu đặt bàn trong tài liệu đã phản ánh chính xác quy trình xử lý thực tế tại nhà hàng.
* Các tài liệu SRS, DBML, ERD và API Design đã được cập nhật đồng bộ.