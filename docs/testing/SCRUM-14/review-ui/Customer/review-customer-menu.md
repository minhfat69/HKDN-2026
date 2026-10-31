## [UI Review] Customer - Trang thực đơn menu.html

| Thông tin | Chi tiết |
| :--- | :--- |
| Module | Customer - Thực đơn |
| File | menu.html |
| Phạm vi | Thực đơn, tìm kiếm, lọc món, sản phẩm và giỏ hàng |
| Loại Review | UI/UX Review - Lần 2 |
| Người thực hiện | Nguyễn Phước Thịnh |
| Ngày xử lý | 10/08/2026 |
| Kết quả | Cần cải thiện |

---

## 1. Mục tiêu Review

- Kiểm tra bố cục trang thực đơn.
- Kiểm tra chức năng tìm kiếm và lọc món dưới góc độ UI.
- Kiểm tra Product Card và cách hiển thị thông tin món ăn.
- Kiểm tra giao diện và khả năng sử dụng của giỏ hàng.
- Kiểm tra luồng chọn món → thêm giỏ hàng → đặt món.
- Kiểm tra màu sắc, icon và component.
- Kiểm tra Responsive.
- Ghi nhận Defect và đề xuất cải tiến UI/UX.

---

## 2. Kết quả Review

### 2.1. Tiêu đề trang Menu

- Nhãn `MENU` được đặt phía trên tiêu đề.
- Tiêu đề `Thực đơn FutureSuShi` nổi bật và dễ nhận biết.
- Phần mô tả nằm ngay dưới tiêu đề, nội dung ngắn gọn.
- Khoảng cách giữa tiêu đề và khu vực tìm kiếm tương đối hợp lý.

| Nội dung | Kết quả |
| :--- | :--- |
| Tiêu đề | Đạt |
| Mô tả | Đạt |
| Bố cục | Đạt |
| Typography | Đạt |

---

### 2.2. Search Box

- Ô tìm kiếm có icon kính lúp giúp nhận biết chức năng.
- Placeholder `Tìm món ăn...` rõ ràng.
- Kích thước ô tìm kiếm lớn, thuận tiện cho việc nhập nội dung.
- Vị trí Search nằm ngay phía trên danh sách món nên dễ tiếp cận.

| Nội dung | Kết quả |
| :--- | :--- |
| Search Box | Đạt |
| Search Icon | Đạt |
| Placeholder | Đạt |
| Vị trí | Đạt |

---

### 2.3. Category Filter

- Dropdown `Tất cả danh mục` được đặt cạnh Search Box.
- Cách bố trí giúp người dùng dễ hiểu đây là công cụ lọc món.
- Kích thước dropdown phù hợp với Search Box.
- Nội dung mặc định rõ ràng.

| Nội dung | Kết quả |
| :--- | :--- |
| Category Select | Đạt |
| Default Value | Đạt |
| Bố cục | Đạt |
| Khả năng nhận biết | Đạt |

---

### 2.4. Product Card

- Hình ảnh món ăn được đặt ở phía trên.
- Tên món ăn được hiển thị rõ ràng.
- Mô tả nằm dưới tên món.
- Giá được đặt ở cuối card và sử dụng màu đỏ để tạo điểm nhấn.
- Nút thêm vào giỏ sử dụng icon giỏ hàng.
- Các card có kích thước và bố cục tương đối đồng nhất.

| Nội dung | Kết quả |
| :--- | :--- |
| Hình ảnh | Đạt |
| Tên món | Đạt |
| Mô tả | Đạt |
| Giá | Đạt |
| Add to Cart | Đạt |
| Card Layout | Đạt |

---


### 2.6. Giỏ hàng

- Giỏ hàng được đặt bên phải danh sách món.
- Tiêu đề `Giỏ hàng` có icon phù hợp.
- Mỗi sản phẩm hiển thị tên, giá và số lượng.
- Có nút `-` và `+` để điều chỉnh số lượng.
- Tổng tiền được đặt riêng ở cuối khu vực giỏ hàng.
- Button `Đặt món ngay` được đặt dưới tổng tiền, phù hợp với luồng thao tác.

| Nội dung | Kết quả |
| :--- | :--- |
| Cart Panel | Đạt |
| Cart Item | Đạt |
| Quantity Control | Đạt |
| Total Price | Đạt |
| Checkout Button | Đạt |

---

### 2.7. Bố cục Product và Cart

- Danh sách món được đặt bên trái.
- Giỏ hàng được đặt bên phải.
- Cách bố trí phù hợp với thao tác chọn món và theo dõi đơn hàng.
- Giỏ hàng có khu vực riêng nên dễ nhận biết.
- Khoảng cách giữa Product Grid và Cart tương đối hợp lý.

| Nội dung | Kết quả |
| :--- | :--- |
| Product Grid | Đạt |
| Cart Position | Đạt |
| Layout | Đạt |
| Khả năng sử dụng | Đạt |

---

## 3. Đánh giá UX/UI

### 3.1. Bố cục

- Các khu vực được phân chia rõ ràng gồm tiêu đề thực đơn, tìm kiếm, lọc danh mục, danh sách sản phẩm và giỏ hàng.
- Luồng nội dung đi từ tìm kiếm / lọc món → chọn món → thêm vào giỏ hàng → kiểm tra tổng tiền → đặt món.
- Product Grid được đặt bên trái và giỏ hàng được đặt bên phải, phù hợp với thao tác đặt món.
- Khu vực tìm kiếm và bộ lọc được đặt phía trên danh sách sản phẩm, dễ tiếp cận.
- Giỏ hàng có khu vực riêng nên người dùng dễ theo dõi các món đã chọn.

| Nội dung | Kết quả |
| :--- | :--- |
| Bố cục | Đạt |
| Product Grid | Đạt |
| Giỏ hàng | Đạt |
| Search / Filter | Đạt |
| Luồng sử dụng | Đạt |
| UX | Đạt |

### 3.2. Màu sắc

- Nền tối được sử dụng xuyên suốt trang.
- Màu đỏ được sử dụng để tạo điểm nhấn cho giá sản phẩm và một số thành phần.
- Màu xanh được sử dụng cho các nút thao tác chính.
- Màu trắng được sử dụng cho tiêu đề và nội dung, tạo độ tương phản với nền tối.
- Tổng thể màu sắc phù hợp với phong cách chung của website.

| Nội dung | Kết quả |
| :--- | :--- |
| Màu nền | Đạt |
| Màu chữ | Đạt |
| Màu nhấn | Đạt |
| Nút thao tác | Đạt |
| Tính nhất quán | Đạt |

### 3.3. Icon và Component

- Icon tìm kiếm giúp người dùng dễ nhận biết chức năng tìm món.
- Icon giỏ hàng phù hợp với chức năng thêm và quản lý sản phẩm.
- Nút `+` và `-` thể hiện rõ thao tác điều chỉnh số lượng.
- Product Card có cấu trúc rõ ràng gồm hình ảnh, tên món, mô tả, giá và nút thêm giỏ hàng.
- Cart Panel được tách riêng và có các thành phần cần thiết để theo dõi đơn hàng.
- Các component có cách bo góc và trình bày tương đối thống nhất.

| Nội dung | Kết quả |
| :--- | :--- |
| Icon | Đạt |
| Product Card | Đạt |
| Cart Panel | Đạt |
| Button | Đạt |
| Quantity Control | Đạt |
| Component | Đạt |
| Tính nhất quán | Đạt |

### 3.4. Nội dung và khả năng sử dụng

- Tên món, mô tả và giá được đặt đúng vị trí trong Product Card.
- Placeholder `Tìm món ăn...` giúp người dùng hiểu rõ chức năng tìm kiếm.
- Dropdown `Tất cả danh mục` giúp người dùng dễ nhận biết chức năng lọc món.
- Thông tin tổng tiền được đặt ở cuối giỏ hàng, phù hợp với luồng đặt món.
- Nút `Đặt món ngay` được đặt sau phần tổng tiền, giúp người dùng dễ xác định bước tiếp theo.
- Cách trình bày thông tin sản phẩm nhìn chung rõ ràng và dễ sử dụng.

| Nội dung | Kết quả |
| :--- | :--- |
| Tên sản phẩm | Đạt |
| Mô tả sản phẩm | Đạt |
| Giá sản phẩm | Đạt |
| Tìm kiếm | Đạt |
| Lọc danh mục | Đạt |
| Tổng tiền | Đạt |
| Đặt món | Đạt |
| Khả năng sử dụng | Đạt |


### 4. Responsive

- Source đã liên kết `responsive.css` để hỗ trợ Responsive cho giao diện web.
- Bố cục hiện tại được chia thành khu vực Product Grid và Cart Panel.
- Cần đảm bảo các thành phần Search, Filter, Product Card và Cart có thể co giãn phù hợp khi kích thước cửa sổ thay đổi.
- Cần kiểm tra tránh tình trạng Product Card bị tràn, nội dung bị che khuất hoặc Cart Panel làm vỡ bố cục.
- Cần kiểm tra kích thước button, ô tìm kiếm và dropdown khi giao diện thay đổi kích thước.

| Nội dung | Kết quả |
| :--- | :--- |
| Search Box | Đạt |
| Category Filter | Đạt |
| Product Grid | Chưa hoàn thành Review |
| Cart Panel | Chưa hoàn thành Review |
| Khả năng co giãn giao diện | Chưa hoàn thành Review |
| Responsive | Chưa hoàn thành Review |

---

## 5. Danh sách Defect

| Mã lỗi | Nội dung | Mức độ | Độ ưu tiên | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| DEF-UI-CUS-004 | Một số thẻ sản phẩm có nội dung chưa đồng đều về độ dài | Nhẹ | Thấp | Đang xử lý |
| DEF-UI-CUS-005 | Khu vực giỏ hàng chiếm diện tích cố định khá lớn so với số lượng sản phẩm hiển thị | Nhẹ | Trung bình | Đang xử lý |
| DEF-UI-CUS-006 | Giỏ hàng chưa có thông báo trực quan khi chưa có sản phẩm | Nhẹ | Trung bình | Đang xử lý |

### DEF-UI-CUS-004 - Nội dung thẻ sản phẩm chưa đồng đều

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-004 |
| Kết quả mong đợi | Các thẻ sản phẩm có bố cục và chiều cao nội dung tương đối đồng đều để giao diện danh sách món cân đối. |
| Kết quả thực tế | Độ dài tên và mô tả giữa các sản phẩm có thể khác nhau, làm phần nội dung trong thẻ không đồng đều. |
| Mức độ | Nhẹ |
| Độ ưu tiên | Thấp |
| Ảnh hưởng | Làm khoảng cách giữa các thành phần trong thẻ sản phẩm không hoàn toàn thống nhất. |
| Đề xuất | Thiết lập giới hạn chiều cao cho khu vực tên và mô tả hoặc chuẩn hóa cách trình bày nội dung sản phẩm. |

### DEF-UI-CUS-005 - Khu vực giỏ hàng chiếm diện tích cố định

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-005 |
| Kết quả mong đợi | Khu vực giỏ hàng có kích thước phù hợp với nội dung và không làm giảm quá nhiều không gian hiển thị danh sách món. |
| Kết quả thực tế | Khu vực giỏ hàng được bố trí cố định bên phải trong khi số lượng sản phẩm hiển thị chưa nhiều. |
| Mức độ | Nhẹ |
| Độ ưu tiên | Trung bình |
| Ảnh hưởng | Làm diện tích hiển thị danh sách sản phẩm bị thu hẹp và tạo cảm giác bố cục chưa cân bằng khi có ít sản phẩm. |
| Đề xuất | Điều chỉnh tỷ lệ giữa danh sách sản phẩm và giỏ hàng hoặc sử dụng kích thước linh hoạt hơn cho khu vực giỏ hàng. |

### DEF-UI-CUS-006 - Giỏ hàng chưa có trạng thái khi chưa có sản phẩm

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-006 |
| Kết quả mong đợi | Khi chưa có sản phẩm, giỏ hàng hiển thị thông báo rõ ràng như `Giỏ hàng đang trống` hoặc hướng dẫn người dùng thêm sản phẩm. |
| Kết quả thực tế | Khu vực giỏ hàng chưa có trạng thái hiển thị trực quan khi chưa có sản phẩm. |
| Mức độ | Nhẹ |
| Độ ưu tiên | Trung bình |
| Ảnh hưởng | Người dùng có thể không nhận biết rõ trạng thái hiện tại của giỏ hàng khi chưa có sản phẩm. |
| Đề xuất | Bổ sung trạng thái giỏ hàng trống với icon và thông báo ngắn gọn, ví dụ `Giỏ hàng đang trống - Hãy chọn món`. |

---

## 6. Đề xuất cải tiến UI/UX

- Bổ sung thêm sản phẩm từ Admin để thực đơn có nhiều lựa chọn hơn cho khách hàng.
- Đảm bảo các sản phẩm được phân loại đúng vào từng danh mục để chức năng Filter có nhiều dữ liệu để kiểm tra.
- Chuẩn hóa chiều cao khu vực tên và mô tả trong Product Card.
- Điều chỉnh tỷ lệ giữa Product Grid và Cart Panel để bố cục cân đối hơn khi số lượng sản phẩm nhiều.
- Bổ sung Empty State cho giỏ hàng khi chưa có sản phẩm.
- Có thể hiển thị thông báo ngắn sau khi người dùng thêm món thành công vào giỏ hàng.
- Có thể bổ sung hiệu ứng Hover cho Product Card và nút thêm vào giỏ hàng.
- Kiểm tra khả năng co giãn của Product Grid và Cart Panel khi thay đổi kích thước giao diện web.

---

## 7. Kết luận

- Trang Thực đơn có bố cục rõ ràng và phù hợp với chức năng đặt món.
- Search và Filter được đặt ở vị trí dễ sử dụng.
- Product Card có đầy đủ các thành phần chính gồm hình ảnh, tên món, mô tả, giá và nút thêm giỏ hàng.
- Giỏ hàng được bố trí rõ ràng và hỗ trợ điều chỉnh số lượng.
- Màu sắc, icon và component tương đối thống nhất với giao diện Customer.
- Cần cải thiện cách hiển thị Product Card khi nội dung giữa các sản phẩm có độ dài khác nhau.
- Khu vực giỏ hàng nên có Empty State rõ ràng để cải thiện trải nghiệm người dùng.
- Nên bổ sung thêm sản phẩm từ Admin để thực đơn có nhiều lựa chọn hơn và hỗ trợ kiểm tra chức năng tìm kiếm, lọc danh mục tốt hơn.
- Responsive của giao diện web cần được kiểm tra thêm để đảm bảo bố cục không bị lỗi khi thay đổi kích thước cửa sổ.

| Nội dung | Kết quả |
| :--- | :--- |
| UI/UX | Đạt |
| Search / Filter | Đạt |
| Product Card | Cần cải thiện |
| Cart | Cần cải thiện |
| Màu sắc | Đạt |
| Icon / Component | Đạt |
| Nội dung sản phẩm | Đạt |
| Số lượng sản phẩm | Cần bổ sung |
| Responsive | Chưa hoàn thành |
| Kết quả Review | Cần cải thiện |