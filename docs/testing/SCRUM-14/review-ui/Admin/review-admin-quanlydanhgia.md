# [UI Review] Admin - Trang Quản lý đánh giá

| Thông tin | Chi tiết |
| :--- | :--- |
| Module | Admin - Quản lý đánh giá |
| Phạm vi | Xem, lọc, tìm kiếm và xóa đánh giá của khách hàng |
| Loại Review | UI/UX Review - Lần 2 |
| Người thực hiện | Nguyễn Phước Thịnh |
| Ngày review | 10/08/2026 |
| Kết quả | Đạt |

---

## 1. Mục tiêu Review

- Kiểm tra bố cục tổng thể của trang Quản lý đánh giá.
- Kiểm tra cách hiển thị điểm đánh giá và phản hồi của khách hàng.
- Kiểm tra bộ lọc theo số sao.
- Kiểm tra khu vực tìm kiếm đánh giá.
- Kiểm tra cách hiển thị thông tin người đánh giá.
- Kiểm tra thao tác xóa đánh giá.
- Kiểm tra tính nhất quán về màu sắc, khoảng cách và Component.
- Đánh giá Responsive trên giao diện Web.
- Ghi nhận Defect nếu có.

---

## 2. Đánh giá giao diện

### 2.1. Header và Sidebar

- Sidebar được sử dụng thống nhất với các trang Admin trước.
- Mục `Đánh giá khách` được Highlight để thể hiện trang hiện tại.
- Breadcrumb `Trang chủ > Đánh giá` giúp người dùng xác định vị trí.
- Header có thanh tìm kiếm hệ thống, đồng hồ, thông báo và nút `POS Gọi Món`.
- Cách bố trí Header và Sidebar tạo cảm giác đồng nhất với toàn bộ hệ thống Admin.

| Nội dung | Kết quả |
| :--- | :--- |
| Sidebar | Đạt |
| Active Menu | Đạt |
| Breadcrumb | Đạt |
| Header | Đạt |
| Search hệ thống | Đạt |

---

### 2.2. Tiêu đề trang

- Tiêu đề `Đánh giá` được đặt ở vị trí dễ nhận biết.
- Phần mô tả `Duyệt phản hồi khách hàng và xóa đánh giá không phù hợp` giúp người quản trị hiểu chức năng của trang.
- Button `Làm mới` được đặt bên phải, phù hợp với các trang Admin khác.
- Khoảng cách giữa tiêu đề, mô tả và Button được bố trí hợp lý.

| Nội dung | Kết quả |
| :--- | :--- |
| Page Title | Đạt |
| Mô tả | Đạt |
| Button Làm mới | Đạt |
| Bố cục | Đạt |

---

### 2.3. Bộ lọc đánh giá

Trang cung cấp các bộ lọc theo số sao:

- Tất cả
- 5 Sao
- 4 Sao
- 1 - 3 Sao

- Filter đang được chọn có màu xanh nổi bật.
- Số lượng đánh giá của từng nhóm được hiển thị bằng Badge.
- Icon ngôi sao giúp người dùng nhận biết nhanh mức đánh giá.
- Search Box được đặt bên phải khu vực Filter.
- Có tùy chọn chuyển đổi giữa Grid và List.

| Nội dung | Kết quả |
| :--- | :--- |
| Filter | Đạt |
| Active Filter | Đạt |
| Badge số lượng | Đạt |
| Star Rating | Đạt |
| Search | Đạt |
| Grid / List | Đạt |

---

## 3. Khu vực tổng quan đánh giá

- Điểm đánh giá trung bình `4.5` được đặt trong một khu vực riêng và có kích thước lớn.
- Số sao được hiển thị trực quan ngay cạnh điểm trung bình.
- Thông tin `Dựa trên 13 phản hồi từ khách hàng` giúp người quản trị biết cơ sở của điểm đánh giá.
- Badge `Hệ thống đánh giá món ăn` giúp xác định nguồn đánh giá.
- Màu xanh được sử dụng làm màu nền chính, tạo điểm nhấn mạnh cho khu vực tổng quan.

### Đánh giá

Khu vực này có khả năng thu hút sự chú ý tốt và giúp người quản trị nắm nhanh chất lượng đánh giá tổng thể của hệ thống.

| Nội dung | Kết quả |
| :--- | :--- |
| Điểm trung bình | Đạt |
| Star Rating | Đạt |
| Số lượng phản hồi | Đạt |
| Badge | Đạt |
| Visual Hierarchy | Đạt |

---

## 4. Review Card

Mỗi đánh giá được hiển thị dưới dạng Card riêng.

Thông tin bao gồm:

- Avatar viết tắt của khách hàng.
- Họ tên người đánh giá.
- Thời gian đánh giá.
- Số sao.
- Nhóm đánh giá như `Không gian` hoặc `Phục vụ`.
- Nội dung phản hồi.
- Button `Xóa đánh giá`.

### Ưu điểm

- Card được phân chia rõ ràng.
- Tên khách hàng có kích thước nổi bật.
- Số sao sử dụng màu vàng giúp dễ nhận biết.
- Nội dung phản hồi được đặt trong khu vực riêng.
- Category của đánh giá được thể hiện bằng Badge màu xanh.
- Button xóa sử dụng màu đỏ để cảnh báo thao tác.
- Khoảng cách giữa các Card tương đối đồng đều.

| Nội dung | Kết quả |
| :--- | :--- |
| Avatar | Đạt |
| Tên khách hàng | Đạt |
| Thời gian | Đạt |
| Star Rating | Đạt |
| Category | Đạt |
| Nội dung đánh giá | Đạt |
| Button Xóa | Đạt |
| Card Layout | Đạt |

---

## 5. UX/UI

### 5.1. Visual Hierarchy

Giao diện có thứ tự ưu tiên thông tin khá rõ:

1. Tiêu đề trang.
2. Bộ lọc đánh giá.
3. Điểm đánh giá tổng quan.
4. Danh sách đánh giá.
5. Nội dung và thao tác trên từng đánh giá.

Cách tổ chức này giúp người quản trị có thể xem tổng quan trước rồi mới đi vào từng phản hồi cụ thể.

**Đánh giá: Đạt.**

---

### 5.2. Màu sắc

- Xanh dương được sử dụng làm màu chủ đạo.
- Vàng được sử dụng cho Star Rating.
- Đỏ được sử dụng cho thao tác `Xóa đánh giá`.
- Màu nền trắng và xám nhạt giúp nội dung dễ đọc.
- Màu sắc phù hợp với hệ thống Admin hiện tại.

**Đánh giá: Đạt.**

---

### 5.3. Typography

- Tiêu đề trang có kích thước lớn và rõ ràng.
- Tên khách hàng được nhấn mạnh.
- Nội dung đánh giá sử dụng kích thước chữ dễ đọc.
- Thông tin phụ như thời gian và số lượng sử dụng kích thước nhỏ hơn.
- Hierarchy giữa nội dung chính và nội dung phụ được thể hiện tốt.

**Đánh giá: Đạt.**

---

## 6. Responsive

Review tập trung trên giao diện Web.

- Layout sử dụng Grid để hiển thị nhiều Review Card.
- Các Card được chia thành nhiều cột giúp tận dụng không gian màn hình.
- Bộ lọc và Search được đặt trong cùng một khu vực.
- Các thành phần chính không bị chồng lấn trên giao diện Web hiện tại.
- Review Card có cấu trúc rõ ràng và có thể mở rộng khi số lượng đánh giá tăng.
- Khu vực tổng quan đánh giá được đặt phía trên danh sách nên vẫn đảm bảo thứ tự thông tin.

| Nội dung | Kết quả |
| :--- | :--- |
| Header | Đạt |
| Sidebar | Đạt |
| Filter | Đạt |
| Search | Đạt |
| Rating Summary | Đạt |
| Review Card | Đạt |
| Grid Layout | Đạt |
| Responsive Web | Đạt |

---

## 7. Danh sách Defect

Qua quá trình review giao diện lần 2:

**Không ghi nhận Defect UI.**

| Defect ID | Nội dung | Mức độ | Ưu tiên | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| - | Không ghi nhận lỗi giao diện | - | - | Đạt |

Giao diện hiện tại đáp ứng tốt các yêu cầu về hiển thị, phân loại, tìm kiếm và quản lý đánh giá.

---

## 8. Đề xuất cải tiến UI/UX

Các đề xuất dưới đây chỉ nhằm làm giao diện hoàn thiện hơn, không phải Defect:

- Có thể sử dụng màu vàng nhẹ cho khu vực Star Rating để tăng tính liên kết với hình ảnh đánh giá.
- Có thể thêm hiệu ứng Hover nhẹ khi người dùng di chuyển chuột lên Review Card.
- Có thể làm nổi bật hơn Category `Không gian`, `Phục vụ`, `Món ăn` bằng các màu phụ khác nhau.
- Có thể bổ sung Tooltip cho các Icon nếu sau này có thêm nhiều thao tác.
- Có thể thêm Confirmation Modal trước khi xóa đánh giá để tránh thao tác nhầm.
- Khi số lượng đánh giá tăng nhiều, có thể bổ sung Pagination.
- Có thể bổ sung sắp xếp theo thời gian hoặc số sao để hỗ trợ quản trị viên xử lý phản hồi nhanh hơn.
- Có thể duy trì hệ thống màu hiện tại để đảm bảo tính nhất quán với Dashboard và các trang quản lý khác.

---

## 9. Kết luận

- Trang Quản lý đánh giá có bố cục rõ ràng và phù hợp với nghiệp vụ quản trị.
- Header và Sidebar thống nhất với hệ thống Admin.
- Bộ lọc theo số sao giúp quản trị viên nhanh chóng phân loại đánh giá.
- Khu vực Rating Summary tạo điểm nhấn tốt và giúp nắm nhanh chất lượng đánh giá.
- Review Card hiển thị đầy đủ thông tin cần thiết.
- Màu sắc được sử dụng hợp lý, đặc biệt là màu vàng cho Rating và màu đỏ cho thao tác xóa.
- Typography và khoảng cách giữa các thành phần được bố trí tốt.
- Responsive trên giao diện Web đáp ứng tốt.
- Không ghi nhận Defect UI trong lần review thứ 2.
- Có thể tiếp tục cải thiện bằng một số hiệu ứng Hover, phân biệt Category rõ hơn và bổ sung Confirmation khi xóa.

### Kết quả tổng hợp

| Hạng mục | Kết quả |
| :--- | :--- |
| Layout | Đạt |
| Header / Sidebar | Đạt |
| Filter | Đạt |
| Search | Đạt |
| Rating Summary | Đạt |
| Review Card | Đạt |
| Typography | Đạt |
| Màu sắc | Đạt |
| UX | Đạt |
| Responsive Web | Đạt |
| Defect | **Không có** |
| Đề xuất cải tiến | **Có** |
| Kết quả Review | **Đạt** |