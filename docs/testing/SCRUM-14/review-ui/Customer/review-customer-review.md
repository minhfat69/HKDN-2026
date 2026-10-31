## [UI Review] Customer - Trang đánh giá review.html

| Thông tin       | Chi tiết |
| :-------------- | :------- |
| Module          | Customer - Đánh giá |
| File            | review.html |
| Phạm vi          | Phần giới thiệu, Form đánh giá, thống kê và danh sách đánh giá |
| Loại Review     | UI/UX Review - Lần 2 |
| Người thực hiện | Nguyễn Phước Thịnh |
| Ngày xử lý | 10/08/2026 |
| Kết quả         | Cần cải thiện |

---

## 1. Mục tiêu Review

- Kiểm tra bố cục trang đánh giá.
- Kiểm tra Form nhập đánh giá và hệ thống chọn số sao.
- Kiểm tra cách hiển thị thống kê đánh giá.
- Kiểm tra danh sách đánh giá của khách hàng.
- Kiểm tra màu sắc, icon và component.
- Kiểm tra Responsive.
- Ghi nhận Defect và đề xuất cải tiến UI/UX.

---

## 2. Kết quả Review

### 2.1. Phần giới thiệu

- Phần giới thiệu `Chia sẻ cảm nhận` được đặt nổi bật ở đầu trang.
- Nội dung mô tả ngắn gọn, đúng mục đích của trang.
- Cách chia bố cục giữa phần giới thiệu và hình ảnh tương đối hợp lý.
- Hình ảnh minh họa bên phải không hiển thị.

| Nội dung | Kết quả |
| :--- | :--- |
| Tiêu đề | Đạt |
| Mô tả | Đạt |
| Bố cục | Đạt |
| Hình ảnh | Không đạt |

---

### 2.2. Form đánh giá

- Form đánh giá được đặt ở khu vực trung tâm, dễ nhận biết.
- Phần chọn số sao được đặt phía trên các trường nhập liệu.
- Trường `Tiêu đề` và `Nội dung` có label và placeholder rõ ràng.
- Nút `Gửi đánh giá` có màu xanh nổi bật và dễ nhận biết.
- Cách bố trí Form tương đối đơn giản và dễ sử dụng.

| Nội dung | Kết quả |
| :--- | :--- |
| Form | Đạt |
| Chọn số sao | Đạt |
| Tiêu đề | Đạt |
| Nội dung | Đạt |
| Nút gửi đánh giá | Đạt |
| Khả năng sử dụng | Đạt |

---

### 2.3. Thống kê đánh giá

- Khu vực thống kê được đặt bên cạnh Form.
- Điểm trung bình `4.9` được làm nổi bật.
- Số lượng `500+` đánh giá được trình bày rõ ràng.
- Các thông tin thống kê dễ nhận biết và không gây rối mắt.
- Tuy nhiên đây chỉ là ảnh tỉnh, cần được chỉnh sửa cho hoạt động.

| Nội dung | Kết quả |
| :--- | :--- |
| Bố cục | Đạt |
| Điểm đánh giá | Đạt |
| Số lượng đánh giá | Đạt |
| Khả năng nhận biết | Đạt |

---

### 2.4. Danh sách đánh giá

- Danh sách đánh giá được đặt phía dưới Form.
- Tiêu đề `Khách hàng nói gì` giúp người dùng nhận biết nội dung.
- Mỗi đánh giá có khu vực hiển thị số sao và nội dung.
- Tuy nhiên, màu nền của Card đánh giá đang khác biệt khá nhiều so với giao diện chính.
- Nội dung đánh giá có màu chữ khá nhạt trên nền trắng, làm khả năng đọc chưa tốt.
- Các Card đánh giá có nhiều khoảng trống, chưa tận dụng tốt diện tích hiển thị.

| Nội dung | Kết quả |
| :--- | :--- |
| Tiêu đề | Đạt |
| Card đánh giá | Cần cải thiện |
| Màu sắc | Cần cải thiện |
| Khả năng đọc | Cần cải thiện |
| Bố cục | Cần cải thiện |

---

## 3. Đánh giá UX/UI

### 3.1. Bố cục

- Các khu vực được phân chia rõ ràng gồm giới thiệu → Form đánh giá → thống kê → danh sách đánh giá.
- Form đánh giá và thống kê được đặt cạnh nhau, phù hợp với mục đích sử dụng.
- Danh sách đánh giá được đặt phía dưới, tạo luồng theo dõi hợp lý.
- Các thành phần chính không bị chồng lấn và dễ nhận biết.

| Nội dung | Kết quả |
| :--- | :--- |
| Bố cục | Đạt |
| Form đánh giá | Đạt |
| Thống kê | Đạt |
| Danh sách đánh giá | Cần cải thiện |
| UX | Cần cải thiện |

### 3.2. Màu sắc

- Nền tối được sử dụng thống nhất với các trang Customer.
- Màu xanh được sử dụng làm màu nhấn cho tiêu đề và nút chính.
- Màu vàng của ngôi sao phù hợp với chức năng đánh giá.
- Tuy nhiên, Card danh sách đánh giá sử dụng nền trắng khác biệt với phần còn lại của trang.
- Màu chữ trong Card đánh giá khá nhạt nên khả năng đọc chưa tốt.

| Nội dung | Kết quả |
| :--- | :--- |
| Màu nền chính | Đạt |
| Màu nhấn | Đạt |
| Màu ngôi sao | Đạt |
| Card đánh giá | Cần cải thiện |
| Tính nhất quán | Cần cải thiện |

### 3.3. Icon và Component

- Icon ngôi sao phù hợp với chức năng đánh giá.
- Các trường nhập liệu có thiết kế đồng nhất.
- Button `Gửi đánh giá` có kích thước lớn và dễ thao tác.
- Các Card thống kê và Card đánh giá được phân chia rõ ràng.
- Component nhìn chung thống nhất với phong cách Customer nhưng Card đánh giá cần điều chỉnh lại màu sắc.

| Nội dung | Kết quả |
| :--- | :--- |
| Icon | Đạt |
| Star Rating | Đạt |
| Input / Textarea | Đạt |
| Button | Đạt |
| Card | Cần cải thiện |
| Component | Đạt |

### 3.4. Nội dung và khả năng sử dụng

- Label của các trường nhập liệu rõ ràng.
- Placeholder giúp người dùng hiểu nội dung cần nhập.
- Quy trình đánh giá đơn giản: chọn số sao → nhập tiêu đề → nhập nội dung → gửi đánh giá.
- Khu vực thống kê giúp người dùng nhanh chóng nắm được điểm đánh giá tổng quan.
- Danh sách đánh giá giúp người dùng tham khảo phản hồi từ các khách hàng khác.
- Cần cải thiện cách hiển thị danh sách đánh giá để nội dung dễ đọc và đồng nhất với giao diện chung.

| Nội dung | Kết quả |
| :--- | :--- |
| Label | Đạt |
| Placeholder | Đạt |
| Luồng đánh giá | Đạt |
| Thống kê | Đạt |
| Danh sách đánh giá | Cần cải thiện |
| Khả năng sử dụng | Cần cải thiện |

---

## 4. Responsive

- Source đã liên kết `responsive.css` để hỗ trợ Responsive cho giao diện web.
- Cần kiểm tra khả năng co giãn của khu vực giới thiệu, Form đánh giá và khu vực thống kê.
- Cần kiểm tra danh sách đánh giá khi kích thước cửa sổ thay đổi.
- Cần đảm bảo các trường nhập liệu, nút `Gửi đánh giá` và khu vực chọn sao không bị tràn hoặc che khuất.
- Cần kiểm tra khoảng cách giữa các Card và nội dung bên trong khi giao diện thay đổi kích thước.

| Nội dung | Kết quả |
| :--- | :--- |
| Phần giới thiệu | Đạt |
| Form đánh giá | Đạt |
| Khu vực thống kê | Cần cải thiện |
| Danh sách đánh giá | Cần cải thiện |
| Khả năng co giãn giao diện | Đạt |
| Responsive | Cần cải thiện |

---

## 5. Danh sách Defect

| Mã lỗi | Nội dung | Mức độ | Độ ưu tiên | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| DEF-UI-CUS-009 | Hình ảnh minh họa ở phần đầu trang không hiển thị | Nghiêm trọng | Cao | Đang xử lý |
| DEF-UI-CUS-010 | Card danh sách đánh giá sử dụng màu nền không đồng nhất với giao diện chung | Nhẹ | Trung bình | Đang xử lý |
| DEF-UI-CUS-011 | Nội dung đánh giá hiển thị quá nhạt, khả năng đọc chưa tốt | Nhẹ | Trung bình | Đang xử lý |

### DEF-UI-CUS-009 - Hình ảnh minh họa không hiển thị

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-009 |
| Kết quả mong đợi | Hình ảnh minh họa hiển thị đầy đủ và đúng vị trí trên trang. |
| Kết quả thực tế | Hình ảnh minh họa không hiển thị và xuất hiện biểu tượng hình ảnh lỗi. |
| Mức độ | Nghiêm trọng |
| Độ ưu tiên | Cao |
| Ảnh hưởng | Làm phần giới thiệu đầu trang thiếu hình ảnh và giảm tính trực quan của giao diện. |
| Đề xuất | Kiểm tra và khắc phục tài nguyên hình ảnh được sử dụng trong phần giới thiệu. |

### DEF-UI-CUS-010 - Card đánh giá chưa đồng nhất màu sắc

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-010 |
| Kết quả mong đợi | Card đánh giá có màu sắc phù hợp với phong cách chung của giao diện Customer. |
| Kết quả thực tế | Card đánh giá sử dụng nền trắng trong khi phần lớn giao diện sử dụng nền tối. |
| Mức độ | Nhẹ |
| Độ ưu tiên | Trung bình |
| Ảnh hưởng | Làm khu vực danh sách đánh giá bị tách biệt về mặt thị giác so với các khu vực khác. |
| Đề xuất | Điều chỉnh màu nền và màu chữ của Card để phù hợp hơn với giao diện chung. |

### DEF-UI-CUS-011 - Nội dung đánh giá khó đọc

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-011 |
| Kết quả mong đợi | Nội dung đánh giá có độ tương phản phù hợp và dễ đọc. |
| Kết quả thực tế | Một số nội dung đánh giá có màu chữ khá nhạt trên nền Card sáng. |
| Mức độ | Nhẹ |
| Độ ưu tiên | Trung bình |
| Ảnh hưởng | Làm giảm khả năng đọc nội dung phản hồi của khách hàng. |
| Đề xuất | Tăng độ tương phản giữa màu chữ và nền Card. |

---

## 6. Đề xuất cải tiến UI/UX

- Khắc phục hình ảnh minh họa không hiển thị ở phần đầu trang.
- Điều chỉnh Card danh sách đánh giá để đồng nhất hơn với phong cách giao diện nền tối.
- Tăng độ tương phản của nội dung đánh giá để người dùng dễ đọc hơn.
- Có thể hiển thị thêm tên người đánh giá và thời gian đánh giá để thông tin rõ ràng hơn.
- Có thể bổ sung trạng thái rõ ràng khi chưa có đánh giá.
- Có thể làm nổi bật đánh giá mới được gửi để người dùng dễ nhận biết.
- Kiểm tra lại khoảng cách và kích thước các Card trong danh sách đánh giá.
- Tiếp tục kiểm tra Responsive của Form, khu vực thống kê và danh sách đánh giá.

---

## 7. Kết luận

- Trang Đánh giá có bố cục rõ ràng và luồng sử dụng đơn giản.
- Form đánh giá được thiết kế dễ hiểu, các trường nhập liệu và nút gửi được bố trí hợp lý.
- Chức năng chọn số sao trực quan và phù hợp với mục đích đánh giá.
- Khu vực thống kê được trình bày rõ ràng, dễ nhận biết.
- Tuy nhiên, giao diện vẫn còn một số vấn đề về hình ảnh, màu sắc và khả năng đọc của danh sách đánh giá.
- Cần ưu tiên xử lý hình ảnh không hiển thị và điều chỉnh Card đánh giá để giao diện đồng nhất hơn.
- Các đề xuất còn lại nhằm cải thiện khả năng đọc và trải nghiệm sử dụng của người dùng.
- Responsive đã được liên kết trong source nhưng chưa hoàn thành kiểm tra thực tế.

| Nội dung | Kết quả |
| :--- | :--- |
| Giao diện tổng thể | Cần cải thiện |
| Phần giới thiệu | Cần cải thiện |
| Form đánh giá | Đạt |
| Chọn số sao | Đạt |
| Thống kê | Đạt |
| Danh sách đánh giá | Cần cải thiện |
| Màu sắc | Cần cải thiện |
| Icon / Component | Đạt |
| Luồng sử dụng | Đạt |
| Hình ảnh | Không đạt |
| Responsive | Cần cải thiện|
| Kết quả Review | Cần cải thiện |