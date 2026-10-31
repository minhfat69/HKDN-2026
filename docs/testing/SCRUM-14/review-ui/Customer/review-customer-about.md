## [UI Review] Customer - Trang giới thiệu about.html

| Thông tin | Chi tiết |
| :--- | :--- |
| Module | Customer - Giới thiệu |
| File | about.html |
| Phạm vi | Giới thiệu, câu chuyện, sứ mệnh, đội ngũ đầu bếp và điểm nổi bật |
| Loại Review | UI/UX Review - Lần 2 |
| Người thực hiện | Nguyễn Phước Thịnh |
| Ngày xử lý | 10/08/2026 |
| Kết quả | Cần cải thiện |

---

## 1. Mục tiêu Review

- Kiểm tra bố cục và cách trình bày nội dung giới thiệu.
- Kiểm tra các section giới thiệu nhà hàng.
- Kiểm tra hình ảnh và thông tin đội ngũ đầu bếp.
- Kiểm tra màu sắc, icon và component.
- Kiểm tra luồng nội dung và khả năng sử dụng.
- Kiểm tra Responsive.
- Ghi nhận Defect và đề xuất cải tiến UI/UX.

---

## 2. Kết quả Review

### 2.1. Phần giới thiệu

- Tiêu đề `FutureSuShi Japanese Restaurant` nổi bật và dễ nhận biết.
- Nội dung giới thiệu ngắn gọn, phù hợp với mục đích của trang.
- Bố cục chia thành phần nội dung và hình ảnh rõ ràng.
- Tuy nhiên, hình ảnh minh họa bên phải hiện không hiển thị.

| Nội dung | Kết quả |
| :--- | :--- |
| Tiêu đề | Đạt |
| Mô tả | Đạt |
| Bố cục | Đạt |
| Hình ảnh | Không đạt |

---

### 2.2. Câu chuyện FutureSuShi

- Tiêu đề `Câu chuyện của FutureSuShi` rõ ràng.
- Nội dung được chia thành các đoạn ngắn, dễ đọc.
- Bố cục hình ảnh và nội dung được phân chia hợp lý.
- Hình ảnh minh họa trong section hiện không hiển thị.

| Nội dung | Kết quả |
| :--- | :--- |
| Tiêu đề | Đạt |
| Nội dung | Đạt |
| Bố cục | Đạt |
| Hình ảnh | Không đạt |

---

### 2.3. Sứ mệnh, Tầm nhìn và Giá trị

- Ba nội dung được trình bày bằng các Card riêng biệt.
- Icon giúp người dùng dễ nhận biết từng nội dung.
- Tiêu đề và mô tả được phân cấp rõ ràng.
- Cách trình bày đồng nhất giữa các Card.

| Nội dung | Kết quả |
| :--- | :--- |
| Card Layout | Đạt |
| Icon | Đạt |
| Typography | Đạt |
| Nội dung | Đạt |
| Tính nhất quán | Đạt |

---

### 2.4. Đội ngũ đầu bếp

- Section có tiêu đề rõ ràng.
- Thông tin từng đầu bếp được trình bày trong Card.
- Tên và thông tin kinh nghiệm được đặt rõ ràng.
- Ba Card có kích thước tương đối đồng đều.
- Hình ảnh của các đầu bếp hiện không hiển thị.

| Nội dung | Kết quả |
| :--- | :--- |
| Tiêu đề | Đạt |
| Chef Card | Đạt |
| Thông tin | Đạt |
| Bố cục | Đạt |
| Hình ảnh | Không đạt |

---

### 2.5. Vì sao chọn chúng tôi

- Các lợi thế của nhà hàng được trình bày bằng các Card riêng biệt.
- Icon giúp phân biệt từng nội dung.
- Tiêu đề ngắn gọn và dễ nhận biết.
- Bố cục 4 Card tương đối cân đối.

| Nội dung | Kết quả |
| :--- | :--- |
| Bố cục | Đạt |
| Icon | Đạt |
| Nội dung | Đạt |
| Tính nhất quán | Đạt |

---

## 3. Đánh giá UX/UI

### 3.1. Bố cục

- Các section được chia rõ ràng theo từng nội dung.
- Luồng nội dung đi từ giới thiệu → câu chuyện → sứ mệnh, tầm nhìn, giá trị → đội ngũ đầu bếp → lý do lựa chọn.
- Các tiêu đề section giúp người dùng dễ theo dõi nội dung.
- Bố cục tổng thể phù hợp với trang giới thiệu nhà hàng.

| Nội dung | Kết quả |
| :--- | :--- |
| Layout | Đạt |
| Phân chia Section | Đạt |
| Typography | Đạt |
| UX | Đạt |

### 3.2. Màu sắc và Component

- Nền tối được sử dụng xuyên suốt.
- Màu xanh được sử dụng làm màu nhấn.
- Card và icon có phong cách thống nhất.
- Các thành phần giao diện phù hợp với nhận diện chung của website.

| Nội dung | Kết quả |
| :--- | :--- |
| Màu nền | Đạt |
| Màu nhấn | Đạt |
| Icon | Đạt |
| Card | Đạt |
| Tính nhất quán | Đạt |

## 4. Responsive

- Source đã liên kết `responsive.css` để hỗ trợ Responsive cho giao diện web.
- Cấu trúc các section được tổ chức rõ ràng, phù hợp để điều chỉnh khi kích thước giao diện thay đổi.
- Cần kiểm tra khả năng co giãn của khu vực giới thiệu, Story, các Card và hình ảnh.
- Cần đảm bảo hình ảnh không bị méo, tràn hoặc che khuất nội dung.
- Cần kiểm tra khoảng cách giữa các Card và các section để giao diện vẫn cân đối khi thay đổi kích thước cửa sổ.

| Nội dung | Kết quả |
| :--- | :--- |
| Hero | Đạt |
| Story Section | Đạt |
| About Card | Đạt |
| Chef Card | Đạt |
| Feature Card | Đạt |
| Khả năng co giãn giao diện | Đạt |
| Responsive | Đạt |

---

## 5. Danh sách Defect

| Mã lỗi | Nội dung | Mức độ | Độ ưu tiên | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| DEF-UI-CUS-012 | Hình ảnh ở phần giới thiệu và câu chuyện không hiển thị | Nghiêm trọng | Cao | Đang xử lý |
| DEF-UI-CUS-013 | Hình ảnh đội ngũ đầu bếp không hiển thị | Nghiêm trọng | Cao | Đang xử lý |

### DEF-UI-CUS-012 - Hình ảnh phần giới thiệu và câu chuyện không hiển thị

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-012 |
| Kết quả mong đợi | Hình ảnh ở phần giới thiệu và câu chuyện được hiển thị đầy đủ, đúng vị trí. |
| Kết quả thực tế | Hình ảnh không được hiển thị và xuất hiện khoảng trống trong bố cục. |
| Mức độ | Nghiêm trọng |
| Độ ưu tiên | Cao |
| Ảnh hưởng | Làm giảm tính trực quan và khiến bố cục của trang chưa hoàn chỉnh. |
| Đề xuất | Kiểm tra và khắc phục đường dẫn hình ảnh trong trang. |

### DEF-UI-CUS-013 - Hình ảnh đội ngũ đầu bếp không hiển thị

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-013 |
| Kết quả mong đợi | Hình ảnh của các đầu bếp được hiển thị đầy đủ trong từng Card. |
| Kết quả thực tế | Khu vực hình ảnh của các Card đầu bếp không hiển thị hình ảnh. |
| Mức độ | Nghiêm trọng |
| Độ ưu tiên | Cao |
| Ảnh hưởng | Làm Card đầu bếp thiếu nội dung trực quan và giảm tính hoàn thiện của section. |
| Đề xuất | Kiểm tra và khắc phục đường dẫn hình ảnh của từng Card đầu bếp. |

---

## 6. Đề xuất cải tiến UI/UX

- Khắc phục các hình ảnh không hiển thị ở phần giới thiệu và câu chuyện.
- Khắc phục hình ảnh của đội ngũ đầu bếp để các Card được hiển thị đầy đủ.
- Duy trì bố cục các section hiện tại vì nội dung được phân chia rõ ràng và dễ theo dõi.
- Tiếp tục sử dụng Card và Icon theo thiết kế hiện tại để đảm bảo tính thống nhất của website.
- Kiểm tra lại các hình ảnh sau khi khắc phục để đảm bảo đúng kích thước và vị trí.
- Có thể bổ sung hiệu ứng nhẹ khi người dùng di chuyển chuột trên các Card để giao diện sinh động hơn.

---

## 7. Kết luận

- Trang Giới thiệu có bố cục rõ ràng, nội dung được phân chia thành các section hợp lý.
- Các nội dung về câu chuyện, sứ mệnh, tầm nhìn, giá trị và đội ngũ đầu bếp được trình bày dễ theo dõi.
- Màu sắc, icon và component được sử dụng tương đối thống nhất với giao diện Customer.
- Luồng nội dung đơn giản và phù hợp với mục đích giới thiệu nhà hàng.
- Responsive của trang được tổ chức phù hợp và không ghi nhận vấn đề lớn trong quá trình review.
- Lỗi chính hiện tại là hình ảnh ở phần giới thiệu, câu chuyện và đội ngũ đầu bếp không hiển thị.
- Cần ưu tiên khắc phục các lỗi hình ảnh để hoàn thiện giao diện.
- Ngoài các lỗi trên, giao diện tổng thể không cần thay đổi lớn.

| Nội dung | Kết quả |
| :--- | :--- |
| Giao diện tổng thể | Đạt |
| Bố cục | Đạt |
| Nội dung | Đạt |
| Màu sắc | Đạt |
| Icon / Component | Đạt |
| UX | Đạt |
| Responsive | Đạt |
| Hình ảnh | Không đạt |
| Đội ngũ đầu bếp | Cần cải thiện |
| Kết quả Review | Cần cải thiện |