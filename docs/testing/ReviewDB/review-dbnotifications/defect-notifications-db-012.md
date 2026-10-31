# [Defect Report] DB-012: Thiếu trường updated_at và ràng buộc NOT NULL bảng Notifications

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-012 |
| **Module** | Notifications |
| **Mức độ (Severity)** | Medium |
| **Loại lỗi (Type)** | Database Schema / Data Consistency |
| **Trạng thái (Status)** | Fixed |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 08/08/2026 |

---

### 1. Mô tả lỗi (Description)
Đối chiếu bảng `notifications` giữa SRS cũ và Database thực tế:
* Tài liệu SRS cũ thiếu trường `updated_at TIMESTAMP`.
* Database thực tế khai báo hai trường `title` và `content` bắt buộc phải có giá trị (`NOT NULL`), nhưng SRS cũ chưa thể hiện các ràng buộc này.

### 2. Nguyên nhân (Root Cause)
Backend đã bổ sung trường `updated_at` để hỗ trợ theo dõi thời gian cập nhật trạng thái thông báo nhưng chưa cập nhật lại tài liệu SRS.

### 3. Ảnh hưởng (Impact)
* SRS không phản ánh đầy đủ cấu trúc Database triển khai thực tế.
* Có thể gây sai lệch khi sinh Migration hoặc đồng bộ cơ sở dữ liệu.
* Chưa thể hiện rõ các quy tắc dữ liệu bắt buộc của thông báo.

### 4. Giải pháp sửa đổi (Resolution)
Cập nhật bảng `notifications` trong SRS và DBML:
* Bổ sung trường `updated_at TIMESTAMP`.
* Bổ sung ràng buộc `NOT NULL` cho `title` và `content`.
* Cập nhật cấu trúc DBML chuẩn:

```dbml
Table notifications {
  id bigint [primary key, increment]
  user_id bigint
  title varchar [not null]
  content text [not null]
  type enum('ORDER', 'PAYMENT', 'POINT', 'PROMOTION', 'SYSTEM') [default: 'SYSTEM']
  is_read boolean [default: false]
  created_at timestamp
  updated_at timestamp
}