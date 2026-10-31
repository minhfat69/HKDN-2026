# [UI Review] Staff - Quản lý đặt bàn

| Thông tin       | Chi tiết                  |
| :-------------- | :------------------------ |
| Module          | Staff - Quản lý đặt bàn   |
| Phạm vi         | Danh sách và quản lý đặt bàn |
| Loại Review     | UI/UX Review - Lần 2      |
| Người thực hiện | Nguyễn Phước Thịnh        |
| Ngày review     | 10/08/2026                |
| Kết quả         | Cần cải thiện             |

---

## 1. Mục tiêu Review

- Kiểm tra bố cục trang quản lý đặt bàn.
- Kiểm tra cách hiển thị thông tin đặt bàn.
- Kiểm tra trạng thái và thao tác trên Table Card.
- Kiểm tra Responsive trên giao diện Web.

---

## 2. Kết quả Review

### 2.1. Tổng quan giao diện

- Sidebar và Header được bố trí rõ ràng.
- Các Card thống kê giúp nhân viên theo dõi nhanh tình trạng đặt bàn.
- Các Tab trạng thái được phân chia rõ ràng.
- Màu sắc trạng thái dễ nhận biết.

| Nội dung       | Kết quả |
| :------------- | :------ |
| Sidebar        | Đạt     |
| Header         | Đạt     |
| Statistic Card | Đạt     |
| Tab trạng thái | Đạt     |
| Màu sắc        | Đạt     |

### 2.2. Reservation Card

- Card hiển thị đầy đủ tên khách hàng, số điện thoại, bàn, số khách, thời gian và trạng thái.
- Trạng thái `Đã hủy` và `Đã xác nhận` được phân biệt bằng màu sắc.
- Các thao tác `Hủy` và trạng thái thời gian được đặt ở cuối Card.

Tuy nhiên, **thông tin trong Card đang bị dồn và xuống dòng**, đặc biệt ở tên khách hàng, trạng thái và thông tin thời gian. Điều này làm Card mất cân đối và gây cảm giác rối mắt.

| Nội dung          | Kết quả       |
| :---------------- | :------------ |
| Thông tin khách   | Đạt           |
| Trạng thái        | Cần cải thiện |
| Thông tin bàn     | Đạt           |
| Thời gian         | Cần cải thiện |
| Bố cục Card       | Cần cải thiện |
| Button            | Đạt           |

---

## 3. Đánh giá UX/UI

### 3.1. Bố cục

- Bố cục tổng thể rõ ràng, các khu vực được phân chia hợp lý.
- Tuy nhiên, Reservation Card chưa cân đối giữa các nhóm thông tin.
- Một số nội dung bị xuống dòng không cần thiết, làm tăng chiều cao Card và tạo nhiều khoảng trống không đồng đều.

### 3.2. Trải nghiệm sử dụng

- Nhân viên vẫn có thể xem và xử lý thông tin đặt bàn.
- Tuy nhiên cần tối ưu lại cách sắp xếp thông tin để có thể đọc nhanh hơn.
- Nên ưu tiên giữ các thông tin quan trọng trên cùng một dòng khi đủ không gian.

---

## 4. Responsive

- Giao diện Web không ghi nhận lỗi vỡ bố cục nghiêm trọng.
- Tuy nhiên khi Card hiển thị ở kích thước hiện tại, nội dung dễ bị xuống dòng.
- Cần điều chỉnh kích thước Card và cách phân chia cột để thông tin hiển thị cân đối hơn.

| Nội dung        | Kết quả       |
| :-------------- | :------------ |
| Sidebar         | Đạt           |
| Header          | Đạt           |
| Statistic Card  | Đạt           |
| Reservation Card| Cần cải thiện |
| Responsive Web  | Đạt           |

---

## 5. Danh sách Defect

| Defect ID        | Nội dung                                      | Mức độ     | Độ ưu tiên | Trạng thái |
| :--------------- | :-------------------------------------------- | :--------- | :--------- | :--------- |
| DEF-UI-STAFF-003 | Nội dung Reservation Card bị xuống dòng, rối mắt | Thấp    | Trung bình | Cần cải thiện |

### DEF-UI-STAFF-003 - Reservation Card chưa cân đối

| Thông tin        | Chi tiết |
| :--------------- | :------- |
| Kết quả mong đợi | Thông tin được sắp xếp gọn, cân đối và hạn chế xuống dòng không cần thiết. |
| Kết quả thực tế  | Tên khách hàng, trạng thái và thời gian bị xuống dòng, làm Card rối mắt. |
| Mức độ           | Thấp |
| Độ ưu tiên       | Trung bình |
| Ảnh hưởng        | Giảm khả năng quan sát và làm giao diện chưa cân đối. |
| Đề xuất          | Tăng kích thước Card và sắp xếp lại các nhóm thông tin theo hàng/cột hợp lý. |

---

## 6. Đề xuất cải tiến UI/UX

- Tăng nhẹ chiều rộng Reservation Card.
- Sắp xếp tên khách hàng và trạng thái trên cùng một hàng.
- Gom `Vị trí & Số khách` và `Thời gian hẹn` thành hai cột cân đối.
- Giảm khoảng cách thừa giữa các khu vực trong Card.
- Giữ màu trạng thái hiện tại vì đang dễ nhận biết.
- Điều chỉnh kích thước chữ và khoảng cách để hạn chế việc xuống dòng.

---

## 7. Kết luận

- Trang Quản lý đặt bàn có bố cục tổng thể rõ ràng và màu sắc trạng thái dễ nhận biết.
- Các thông tin cần thiết cho việc xử lý đặt bàn đều được hiển thị đầy đủ.
- Vấn đề chính là **Reservation Card đang bị dồn thông tin, xuống dòng và chưa cân đối**, tương tự vấn đề về bố cục Card ở các trang trước.
- Không có lỗi giao diện nghiêm trọng.
- Cần ưu tiên chỉnh lại cấu trúc Card để thông tin gọn, dễ đọc và chuyên nghiệp hơn.

| Nội dung          | Kết quả           |
| :---------------- | :---------------- |
| Layout            | Đạt               |
| Statistic Card    | Đạt               |
| Reservation Card  | Cần cải thiện     |
| Màu sắc           | Đạt               |
| Responsive Web    | Đạt               |
| Defect            | 1 vấn đề UI       |
| Kết quả Review    | **Cần cải thiện** |