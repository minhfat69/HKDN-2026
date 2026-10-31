# [UI Review] Staff - Quản lý bàn

| Thông tin       | Chi tiết                 |
| :-------------- | :----------------------- |
| Module          | Staff - Quản lý bàn      |
| Phạm vi         | Quản lý bàn và mã QR     |
| Loại Review     | UI/UX Review - Lần 2     |
| Người thực hiện | Nguyễn Phước Thịnh       |
| Ngày review     | 10/08/2026               |
| Kết quả         | Cần cải thiện            |

---

## 1. Mục tiêu Review

- Kiểm tra bố cục giao diện quản lý bàn.
- Kiểm tra cách hiển thị thông tin từng bàn.
- Kiểm tra khu vực trạng thái và thao tác QR.
- Kiểm tra khả năng quan sát và sử dụng trên Web.

---

## 2. Kết quả Review

### 2.1. Tổng quan giao diện

- Sidebar và Header được bố trí rõ ràng.
- Các Card thống kê giúp nhân viên nhanh chóng nắm được tình trạng bàn.
- Khu vực `Quản lý bàn` được thiết kế đơn giản, dễ sử dụng.
- Màu sắc trạng thái được phân biệt rõ ràng.

| Nội dung       | Kết quả |
| :------------- | :------ |
| Sidebar        | Đạt     |
| Header         | Đạt     |
| Statistic Card | Đạt     |
| Màu sắc        | Đạt     |
| Bố cục         | Đạt     |

### 2.2. Table Card

- Card bàn hiển thị các thông tin chính như số bàn, trạng thái, số chỗ và QR.
- Các trạng thái được sử dụng màu sắc khác nhau để dễ nhận biết.
- Có thao tác thay đổi trạng thái và mở mã QR.

Tuy nhiên, **Table Card hiện đang có kích thước hơi nhỏ**, khiến thông tin bên trong bị dồn và khó quan sát, đặc biệt khi số lượng thông tin tăng.

| Nội dung          | Kết quả       |
| :---------------- | :------------ |
| Số bàn            | Đạt           |
| Trạng thái        | Đạt           |
| Thông tin chỗ     | Đạt           |
| QR                 | Đạt           |
| Kích thước Card   | Cần cải thiện |
| Khả năng quan sát | Cần cải thiện |

### 2.3. QR Modal

- Modal hiển thị mã QR rõ ràng.
- Tên bàn và sức chứa được trình bày đầy đủ.
- Có Button `Tải Mã QR` và `In Mã QR`.
- Bố cục Modal tương đối cân đối và dễ sử dụng.

| Nội dung       | Kết quả |
| :------------- | :------ |
| QR Code        | Đạt     |
| Thông tin bàn  | Đạt     |
| Button         | Đạt     |
| Bố cục Modal   | Đạt     |

---

## 3. Đánh giá UX/UI

### 3.1. Bố cục

- Giao diện tổng thể rõ ràng và phù hợp với nghiệp vụ Staff.
- Các thông tin quan trọng được phân chia thành từng khu vực.
- Tuy nhiên Table Card nhỏ so với không gian nội dung, tạo nhiều khoảng trống trên trang.

### 3.2. Trải nghiệm sử dụng

- Nhân viên có thể nhanh chóng xem trạng thái bàn.
- Các thao tác trạng thái và QR dễ nhận biết.
- Cần tăng kích thước Table Card để thông tin bàn dễ đọc và thao tác thuận tiện hơn.

---

## 4. Responsive

- Giao diện Web giữ được bố cục chính và không ghi nhận lỗi vỡ giao diện nghiêm trọng.
- Khi hiển thị nhiều bàn, nên đảm bảo kích thước Card đủ lớn để thông tin không bị thu nhỏ hoặc dồn vào nhau.

| Nội dung       | Kết quả       |
| :------------- | :------------ |
| Sidebar        | Đạt           |
| Header         | Đạt           |
| Table Card     | Cần cải thiện |
| QR Modal       | Đạt           |
| Responsive Web | Đạt           |

---

## 5. Danh sách Defect

| Defect ID        | Nội dung                                      | Mức độ     | Độ ưu tiên | Trạng thái |
| :--------------- | :-------------------------------------------- | :--------- | :--------- | :--------- |
| DEF-UI-STAFF-002 | Table Card hiển thị thông tin bàn hơi nhỏ     | Thấp       | Trung bình | Cần cải thiện |

### DEF-UI-STAFF-002 - Table Card hiển thị nhỏ

| Thông tin        | Chi tiết |
| :--------------- | :------- |
| Kết quả mong đợi | Card có kích thước phù hợp, thông tin bàn được hiển thị rõ ràng và dễ thao tác. |
| Kết quả thực tế  | Card có kích thước nhỏ, thông tin bị dồn trong diện tích hạn chế. |
| Mức độ           | Thấp |
| Độ ưu tiên       | Trung bình |
| Ảnh hưởng        | Giảm khả năng quan sát và làm giao diện chưa tận dụng tốt không gian Web. |
| Đề xuất          | Tăng nhẹ kích thước Card và khoảng cách giữa các thành phần. |

---

## 6. Đề xuất cải tiến UI/UX

- Tăng nhẹ chiều rộng và chiều cao của Table Card.
- Tăng khoảng cách giữa tên bàn, trạng thái và thông tin sức chứa.
- Làm nổi bật số bàn và trạng thái hiện tại.
- Có thể sử dụng Card lớn hơn khi số lượng bàn ít để tận dụng không gian Web.
- Giữ nguyên hệ thống màu trạng thái hiện tại vì đang dễ nhận biết.

---

## 7. Kết luận

- Giao diện Quản lý bàn có bố cục rõ ràng, màu sắc dễ nhận biết và phù hợp với nghiệp vụ Staff.
- QR Modal được thiết kế tốt, thông tin và thao tác được trình bày rõ ràng.
- Vấn đề chính là **Table Card đang hơi nhỏ so với không gian Web**, khiến thông tin bàn chưa được nổi bật.
- Không có lỗi giao diện nghiêm trọng.
- Chỉ cần điều chỉnh kích thước và khoảng cách trong Card để giao diện cân đối và dễ sử dụng hơn.

| Nội dung       | Kết quả           |
| :------------- | :---------------- |
| Layout         | Đạt               |
| Table Card     | Cần cải thiện     |
| QR Modal        | Đạt               |
| Màu sắc        | Đạt               |
| Responsive Web | Đạt               |
| Defect         | 1 vấn đề UI       |
| Kết quả Review | **Cần cải thiện** |