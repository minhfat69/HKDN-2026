# [UI Review] Admin - Trang Dashboard

| Thông tin | Chi tiết |
| :--- | :--- |
| Module | Admin - Dashboard |
| Phạm vi | Dashboard, thống kê, cảnh báo, đơn hàng, QR gọi món và thanh toán |
| Loại Review | UI/UX Review - Lần 2 |
| Người thực hiện | Nguyễn Phước Thịnh |
| Ngày review | 10/08/2026 |
| Kết quả | Cần cải thiện |

---

## 1. Mục tiêu Review

- Kiểm tra bố cục và khả năng sử dụng của Dashboard Admin.
- Kiểm tra cách hiển thị thông tin thống kê và cảnh báo.
- Kiểm tra khu vực đơn hàng gần đây.
- Kiểm tra giao diện QR gọi món.
- Kiểm tra giao diện thanh toán tiền mặt và PayOS.
- Kiểm tra tính nhất quán của màu sắc, icon và component.
- Kiểm tra Responsive.
- Ghi nhận Defect và đề xuất cải tiến UI/UX.

---

## 2. Kết quả Review

### 2.1. Sidebar và điều hướng

- Sidebar được chia thành các nhóm chức năng rõ ràng.
- Các nhóm chức năng giúp Admin dễ tìm và truy cập chức năng.
- Mục đang chọn được làm nổi bật bằng màu xanh.
- Khu vực tài khoản Admin được đặt ở cuối Sidebar.

| Nội dung | Kết quả |
| :--- | :--- |
| Sidebar | Đạt |
| Điều hướng | Đạt |
| Phân nhóm chức năng | Đạt |
| Active Menu | Đạt |

### 2.2. Header và tìm kiếm

- Header có Breadcrumb giúp xác định vị trí hiện tại.
- Có ô tìm kiếm nhanh cho hệ thống.
- Các chức năng thời gian, làm mới và thông báo được bố trí rõ ràng.
- Nút `POS Gọi Món` nổi bật và dễ nhận biết.

| Nội dung | Kết quả |
| :--- | :--- |
| Header | Đạt |
| Breadcrumb | Đạt |
| Search | Đạt |
| Nút POS | Đạt |
| Icon chức năng | Đạt |

### 2.3. Cảnh báo hệ thống

- Cảnh báo tồn kho và cảnh báo bàn được đặt ở khu vực phía trên Dashboard.
- Màu sắc giúp phân biệt các trạng thái cảnh báo.
- Các nút xử lý như `Kiểm tra kho` và `Sơ đồ bàn` dễ nhận biết.

| Nội dung | Kết quả |
| :--- | :--- |
| Cảnh báo | Đạt |
| Màu trạng thái | Đạt |
| CTA | Đạt |
| Khả năng nhận biết | Đạt |

### 2.4. Thống kê tổng quan

- Các chỉ số chính được chia thành từng Card.
- Hiển thị doanh thu, đơn hoàn thành, bàn đang có khách và khách hàng thành viên.
- Badge được sử dụng để thể hiện mức tăng trưởng hoặc trạng thái.
- Cách bố trí giúp Admin nhanh chóng nắm được tình hình hoạt động.

| Nội dung | Kết quả |
| :--- | :--- |
| Statistic Card | Đạt |
| Typography | Đạt |
| Badge trạng thái | Đạt |
| Bố cục | Đạt |

### 2.5. Biểu đồ và thống kê món ăn

- Khu vực phân tích doanh thu được đặt bên trái.
- Biểu đồ món bán chạy theo danh mục được đặt bên phải.
- Có bộ lọc thời gian cho phần phân tích.
- Biểu đồ doanh thu trong giao diện kiểm tra chưa thể hiện dữ liệu trực quan rõ ràng.

| Nội dung | Kết quả |
| :--- | :--- |
| Biểu đồ | Cần cải thiện |
| Bộ lọc thời gian | Đạt |
| Thống kê danh mục | Đạt |
| Khả năng đọc dữ liệu | Cần cải thiện |

### 2.6. Đơn hàng gần đây

- Danh sách đơn hàng được trình bày dạng bảng.
- Có các thông tin mã đơn, khách hàng, thời gian, trạng thái và tổng tiền.
- Trạng thái đơn hàng được hiển thị bằng Badge.
- Có liên kết `Xem tất cả` để chuyển đến danh sách đơn hàng đầy đủ.

| Nội dung | Kết quả |
| :--- | :--- |
| Bảng đơn hàng | Đạt |
| Thông tin đơn | Đạt |
| Trạng thái | Đạt |
| Xem tất cả | Đạt |

### 2.7. QR gọi món

- QR gọi món được đặt trong khu vực riêng.
- Có nút `Tải xuống` và `Chia sẻ`.
- Trạng thái QR được hiển thị rõ ràng bằng `Online Live`.

| Nội dung | Kết quả |
| :--- | :--- |
| QR Code | Đạt |
| Trạng thái | Đạt |
| Download | Đạt |
| Chia sẻ | Đạt |

### 2.8. Giao diện thanh toán

- Hệ thống có Modal thanh toán riêng.
- Hỗ trợ hai phương thức gồm tiền mặt và chuyển khoản PayOS/VietQR.
- Modal hiển thị tổng tiền và số món trong đơn hàng.
- Có khu vực nhập tiền khách đưa và tính tiền thừa.
- Có QR thanh toán và các nút kiểm tra trạng thái PayOS.
- Các nút xác nhận thanh toán được đặt rõ ràng.

| Nội dung | Kết quả |
| :--- | :--- |
| Payment Modal | Đạt |
| Tiền mặt | Đạt |
| PayOS / VietQR | Đạt |
| Tổng tiền | Đạt |
| Nút xác nhận | Đạt |

---

## 3. Đánh giá UX/UI

### 3.1. Bố cục

- Dashboard có cấu trúc rõ ràng.
- Thông tin quan trọng được ưu tiên ở khu vực phía trên.
- Các Card thống kê, biểu đồ và bảng đơn hàng được phân chia hợp lý.
- Sidebar hỗ trợ điều hướng nhanh giữa các chức năng.

| Nội dung | Kết quả |
| :--- | :--- |
| Layout | Đạt |
| Điều hướng | Đạt |
| Phân cấp thông tin | Đạt |
| UX | Đạt |

### 3.2. Màu sắc

- Màu xanh được sử dụng làm màu chủ đạo cho các chức năng chính.
- Màu xanh lá, vàng và đỏ được sử dụng để thể hiện trạng thái.
- Nền sáng giúp nội dung Dashboard dễ đọc.
- Tổng thể màu sắc tương đối thống nhất.

| Nội dung | Kết quả |
| :--- | :--- |
| Màu nền | Đạt |
| Màu chủ đạo | Đạt |
| Màu trạng thái | Đạt |
| Tính nhất quán | Đạt |

### 3.3. Luồng sử dụng

``text
Đăng nhập Admin
↓
Dashboard
↓
Xem cảnh báo
↓
Kiểm tra thống kê
↓
Xem đơn hàng gần đây
↓
Kiểm tra QR / bàn
↓
Xử lý đơn hàng
↓
Thanh toán
↓
Xác nhận hoàn tất

## 4. Responsive

- Giao diện Dashboard được thiết kế theo dạng web quản trị với Sidebar, Header và khu vực nội dung chính.
- Các khu vực Dashboard được bố trí theo dạng Card và Grid, phù hợp với màn hình máy tính.
- Sidebar và Header giữ được vị trí ổn định khi người dùng cuộn trang.
- Các Card thống kê, biểu đồ và bảng đơn hàng được bố trí tương đối cân đối trên giao diện web.
- Payment Modal có kích thước phù hợp và các nút thao tác được bố trí rõ ràng.
- Không ghi nhận lỗi bố cục đáng kể trên giao diện web trong quá trình review.

| Nội dung | Kết quả |
| :--- | :--- |
| Sidebar | Đạt |
| Header | Đạt |
| Dashboard Card | Đạt |
| Biểu đồ | Đạt |
| Bảng đơn hàng | Đạt |
| Payment Modal | Đạt |
| Bố cục trên Web | Đạt |
| Responsive Web | Đạt |

---

## 5. Danh sách Defect

| Defect ID | Nội dung | Mức độ | Độ ưu tiên | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| DEF-UI-ADM-001 | Biểu đồ doanh thu hiển thị chưa rõ ràng về dữ liệu | Nhẹ | Trung bình | Đang xử lý |
| DEF-UI-ADM-002 | Một số thành phần thống kê có cách hiển thị chưa đồng nhất | Nhẹ | Thấp | Đang xử lý |
| DEF-UI-ADM-003 | Một số khu vực sử dụng khoảng trắng khá lớn | Nhẹ | Thấp | Đang xử lý |
| DEF-UI-ADM-004 | Payment Modal sử dụng nhiều Inline Style | Nhẹ | Thấp | Đang xử lý |

### DEF-UI-ADM-001 - Biểu đồ doanh thu chưa rõ ràng

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-ADM-001 |
| Kết quả mong đợi | Biểu đồ hiển thị dữ liệu doanh thu rõ ràng, dễ quan sát và so sánh. |
| Kết quả thực tế | Biểu đồ hiện tại chưa thể hiện đầy đủ thông tin trực quan trong khu vực hiển thị. |
| Mức độ | Nhẹ |
| Độ ưu tiên | Trung bình |
| Ảnh hưởng | Làm giảm khả năng quan sát nhanh số liệu doanh thu. |
| Đề xuất | Cải thiện cách hiển thị dữ liệu, nhãn và giá trị trên biểu đồ. |

### DEF-UI-ADM-002 - Thành phần thống kê chưa đồng nhất

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-ADM-002 |
| Kết quả mong đợi | Các Card thống kê có cách trình bày số liệu, trạng thái và phần trăm thống nhất. |
| Kết quả thực tế | Một số Card có cách trình bày thông tin phụ và trạng thái khác nhau. |
| Mức độ | Nhẹ |
| Độ ưu tiên | Thấp |
| Ảnh hưởng | Làm giảm tính đồng nhất của giao diện Dashboard. |
| Đề xuất | Chuẩn hóa cách hiển thị số liệu, Badge và nội dung mô tả. |

### DEF-UI-ADM-003 - Khoảng trắng trong giao diện

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-ADM-003 |
| Kết quả mong đợi | Khoảng cách giữa các khu vực được phân bổ hợp lý và tận dụng tốt diện tích màn hình. |
| Kết quả thực tế | Một số khu vực có khoảng trắng tương đối lớn, đặc biệt giữa các Section. |
| Mức độ | Nhẹ |
| Độ ưu tiên | Thấp |
| Ảnh hưởng | Làm Dashboard có cảm giác chưa tối ưu về mật độ thông tin. |
| Đề xuất | Điều chỉnh khoảng cách và chiều cao các Section phù hợp hơn. |

### DEF-UI-ADM-004 - Sử dụng nhiều Inline Style

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-ADM-004 |
| Kết quả mong đợi | Các thành phần giao diện sử dụng CSS class thống nhất. |
| Kết quả thực tế | Payment Modal sử dụng nhiều thuộc tính `style` trực tiếp trong HTML. |
| Mức độ | Nhẹ |
| Độ ưu tiên | Thấp |
| Ảnh hưởng | Khó duy trì tính đồng nhất khi cần chỉnh sửa giao diện. |
| Đề xuất | Tách các Inline Style thành CSS class riêng. |

---

## 6. Đề xuất cải tiến UI/UX

- Cải thiện cách hiển thị biểu đồ doanh thu để thông tin trực quan và dễ đọc hơn.
- Chuẩn hóa cách hiển thị số liệu giữa các Dashboard Card.
- Điều chỉnh khoảng cách giữa các Section để tận dụng tốt hơn diện tích màn hình.
- Tách Inline Style trong Payment Modal thành các CSS class riêng.
- Duy trì cách phân nhóm chức năng của Sidebar vì đang rõ ràng và dễ sử dụng.
- Duy trì hệ thống màu xanh chủ đạo kết hợp các màu trạng thái vì phù hợp với giao diện quản trị.
- Duy trì cách sử dụng Card và Badge vì giúp thông tin được phân chia rõ ràng.

---

## 7. Kết luận

- Dashboard Admin có giao diện rõ ràng, hiện đại và phù hợp với hệ thống quản lý nhà hàng.
- Sidebar và Header được bố trí hợp lý, giúp người dùng dễ dàng điều hướng.
- Các Card thống kê, cảnh báo, bảng đơn hàng và QR gọi món được phân chia rõ ràng.
- Giao diện web có bố cục ổn định, các thành phần chính hiển thị tốt trên màn hình máy tính.
- Payment Modal có bố cục rõ ràng và các phương thức thanh toán được phân biệt tốt.
- Các lỗi ghi nhận chủ yếu liên quan đến chi tiết giao diện, cách trình bày biểu đồ, khoảng cách và tính nhất quán của CSS.
- Không ghi nhận lỗi nghiêm trọng ảnh hưởng trực tiếp đến bố cục giao diện.
- Tổng thể giao diện đạt yêu cầu, chỉ cần cải thiện một số chi tiết để tăng tính đồng nhất và hoàn thiện UI.

| Nội dung | Kết quả |
| :--- | :--- |
| Layout | Đạt |
| Sidebar / Navigation | Đạt |
| Dashboard Card | Đạt |
| Cảnh báo | Đạt |
| Đơn hàng | Đạt |
| QR gọi món | Đạt |
| Payment Modal | Đạt |
| Màu sắc | Đạt |
| Typography | Đạt |
| Responsive Web | Đạt |
| Biểu đồ | Cần cải thiện |
| Tính nhất quán UI | Cần cải thiện |
| Kết quả Review | **Đạt - Cần cải thiện một số chi tiết** |