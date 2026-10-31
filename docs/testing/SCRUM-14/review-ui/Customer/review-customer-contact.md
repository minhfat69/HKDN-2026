# [UI Review] Customer - Trang Liên hệ contact.html

| Thông tin | Chi tiết |
| :--- | :--- |
| Module | Customer - Liên hệ |
| File | contact.html |
| Phạm vi | Giao diện liên hệ, thông tin liên hệ, biểu mẫu và bản đồ |
| Loại Review | UI/UX Review - Lần 2 |
| Người thực hiện | Nguyễn Phước Thịnh |
| Ngày xử lý | 10/08/2026 |
| Kết quả | Cần cải thiện |

---

## 1. Mục tiêu Review

- Kiểm tra bố cục và cách trình bày trang Liên hệ.
- Kiểm tra khu vực thông tin liên hệ.
- Kiểm tra biểu mẫu liên hệ.
- Kiểm tra cách hiển thị địa chỉ và bản đồ.
- Kiểm tra màu sắc, icon và các component.
- Kiểm tra Responsive.
- Ghi nhận Defect và đề xuất cải tiến UI/UX.

---

## 2. Kết quả Review

### 2.1. Tiêu đề và khu vực Hero

- Tiêu đề `Liên hệ FutureSuShi` được hiển thị rõ ràng.
- Phần mô tả ngắn gọn, phù hợp với mục đích của trang.
- Nhãn `CONTACT` giúp người dùng nhận biết khu vực hiện tại.
- Tuy nhiên, hình ảnh minh họa bên phải Hero không hiển thị.

| Nội dung | Kết quả |
| :--- | :--- |
| Tiêu đề | Đạt |
| Mô tả | Đạt |
| Bố cục | Đạt |
| Hình ảnh Hero | Không đạt |

---

### 2.2. Thông tin liên hệ

- Khu vực `Thông tin liên hệ` được bố trí riêng biệt.
- Các thông tin địa chỉ, hotline, email và giờ mở cửa được trình bày rõ ràng.
- Icon được sử dụng để minh họa cho từng loại thông tin.
- Cách trình bày giúp người dùng dễ dàng tìm kiếm thông tin cần thiết.

| Nội dung | Kết quả |
| :--- | :--- |
| Tiêu đề | Đạt |
| Địa chỉ | Đạt |
| Hotline | Đạt |
| Email | Đạt |
| Giờ mở cửa | Đạt |
| Icon | Đạt |
| Bố cục | Đạt |

---

### 2.3. Biểu mẫu liên hệ

- Biểu mẫu được đặt cạnh khu vực thông tin liên hệ.
- Các trường `Họ và tên`, `Email`, `Tiêu đề` và `Nội dung` có label rõ ràng.
- Placeholder giúp người dùng biết nội dung cần nhập.
- Button `Gửi liên hệ` có màu xanh nổi bật và dễ nhận biết.
- Bố cục form đơn giản, phù hợp với mục đích gửi liên hệ.

| Nội dung | Kết quả |
| :--- | :--- |
| Label | Đạt |
| Input | Đạt |
| Placeholder | Đạt |
| Textarea | Đạt |
| Button | Đạt |
| Bố cục Form | Đạt |

---

### 2.4. Bản đồ

- Khu vực bản đồ được đặt riêng phía dưới phần thông tin liên hệ.
- Tiêu đề `Vị trí nhà hàng` giúp người dùng dễ nhận biết.
- Bản đồ Google Maps được nhúng trực tiếp vào trang.
- Kích thước bản đồ lớn, thuận tiện cho việc quan sát vị trí.
- Có gắn được thông tin vị trí của quán, dựa trên gg maps.

| Nội dung | Kết quả |
| :--- | :--- |
| Tiêu đề | Đạt |
| Bản đồ | Đạt |
| Kích thước | Đạt |
| Khả năng nhận biết | Đạt |
| Thông tin vị trí |  Đạt |

---

## 3. Đánh giá UX/UI

### 3.1. Bố cục

- Các khu vực chính được phân chia rõ ràng.
- Thông tin liên hệ và biểu mẫu được đặt cạnh nhau, thuận tiện cho người dùng.
- Bản đồ được đặt bên dưới, tạo thành một luồng nội dung hợp lý.
- Khoảng cách giữa các khu vực tương đối cân đối.

| Nội dung | Kết quả |
| :--- | :--- |
| Layout | Đạt |
| Phân chia section | Đạt |
| Khoảng cách | Đạt |
| CTA | Đạt |
| UX | Đạt |

### 3.2. Màu sắc và Component

- Nền tối được sử dụng thống nhất với giao diện Customer.
- Màu xanh được sử dụng làm màu nhấn cho icon, button và tiêu đề.
- Card thông tin và form có kiểu dáng thống nhất.
- Các icon giúp người dùng dễ nhận biết từng loại thông tin.
- Tổng thể giao diện phù hợp với phong cách của FutureSuShi.

| Nội dung | Kết quả |
| :--- | :--- |
| Màu nền | Đạt |
| Màu nhấn | Đạt |
| Icon | Đạt |
| Button | Đạt |
| Card | Đạt |
| Tính nhất quán | Đạt |

### 3.3. Luồng sử dụng

Luồng chính của trang:

```text
Xem tiêu đề và giới thiệu
↓
Xem thông tin liên hệ
↓
Nhập họ tên
↓
Nhập email
↓
Nhập tiêu đề
↓
Nhập nội dung
↓
Gửi liên hệ
↓
Xem vị trí nhà hàng trên bản đồ