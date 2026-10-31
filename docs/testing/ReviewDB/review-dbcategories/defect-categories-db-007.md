# [Defect Report] DB-006: Thiếu ràng buộc NOT NULL và độ dài VARCHAR bảng Categories

| Thông tin | Chi tiết |
| :--- | :--- |
| **Defect ID** | DB-006 |
| **Module** | Categories |
| **Mức độ (Severity)** | Medium |
| **Loại lỗi (Type)** | Database Schema / Data Constraint |
| **Trạng thái (Status)** | Fixed |
| **Người thực hiện** | Nguyễn Anh Huy - 052205001707 |
| **Ngày xử lý** | 08/08/2026 |

---

### 1. Mô tả lỗi (Description)
Trong quá trình đối chiếu bảng `categories` giữa tài liệu SRS cũ và Database thực tế, phát hiện tài liệu chưa thể hiện đầy đủ các ràng buộc và kiểu dữ liệu:
* SRS chưa xác định độ dài cụ thể cho trường `name` (`VARCHAR`).
* SRS chưa khai báo ràng buộc `NOT NULL` cho trường `name`.
* Database thực tế yêu cầu trường `name` bắt buộc phải có giá trị.

### 2. Nguyên nhân (Root Cause)
Tài liệu SRS ban đầu chỉ mô tả kiểu dữ liệu tổng quát và chưa được cập nhật kịp thời theo các ràng buộc bổ sung trong Model Sequelize.

### 3. Ảnh hưởng (Impact)
* Không thể hiện đầy đủ quy tắc dữ liệu của Category trong tài liệu SRS.
* Có thể dẫn đến việc tạo dữ liệu Category không hợp lệ nếu triển khai Database theo tài liệu cũ.
* DBML, ERD và SRS không hoàn toàn đồng bộ với nhau.

### 4. Giải pháp sửa đổi (Resolution)
* Cập nhật kiểu dữ liệu trường `name` thành `VARCHAR(100)`.
* Bổ sung ràng buộc `NOT NULL` cho trường `name`.
* Đồng bộ cấu trúc bảng `categories` giữa SRS, DBML và Model Sequelize.

### 5. Kết quả sau sửa đổi (Result)
* Trường `name` được xác định rõ độ dài tối đa 100 ký tự và bắt buộc phải nhập giá trị.
* Tài liệu SRS và DBML đã đồng bộ hoàn toàn với Database thực tế.

### 6. Kết quả kiểm tra lại (Retest)
| Nội dung kiểm tra | Kết quả |
| :--- | :---: |
| `name` có kiểu `VARCHAR(100)` | Đạt |
| `name` có ràng buộc `NOT NULL` | Đạt |
| Trường `description` hợp lệ | Đạt |
| Trường `image` hợp lệ | Đạt |
| SRS đồng bộ hoàn toàn với DBML | Khớp |