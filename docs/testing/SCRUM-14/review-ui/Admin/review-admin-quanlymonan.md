# [UI Review] Admin - Trang Quản lý món ăn

| Thông tin | Chi tiết |
| :--- | :--- |
| Module | Admin - Quản lý món ăn |
| Phạm vi | Danh sách món ăn, thống kê, tìm kiếm, lọc, thêm, sửa và xóa món |
| Loại Review | UI/UX Review - Lần 2 |
| Người thực hiện | Nguyễn Phước Thịnh |
| Ngày review | 10/08/2026 |
| Kết quả | Đạt - Cần cải thiện một số chi tiết |

---

## 1. Mục tiêu Review

- Kiểm tra bố cục trang quản lý món ăn.
- Kiểm tra cách hiển thị thông tin món ăn.
- Kiểm tra khu vực thống kê món ăn.
- Kiểm tra chức năng tìm kiếm và lọc món.
- Kiểm tra các nút thêm, sửa và xóa món.
- Kiểm tra màu sắc, icon và các component giao diện.
- Kiểm tra Responsive trên giao diện Web.
- Ghi nhận Defect và đề xuất cải tiến UI/UX.

---

## 2. Kết quả Review

### 2.1. Header và tiêu đề trang

- Breadcrumb `Trang chủ > Sản phẩm` giúp xác định vị trí hiện tại.
- Tiêu đề `Sản phẩm` được đặt rõ ràng ở đầu nội dung.
- Phần mô tả giúp người dùng hiểu nhanh chức năng của trang.
- Nút `Thêm sản phẩm` được làm nổi bật.
- Nút `Làm mới` được đặt cạnh nút thêm sản phẩm.

| Nội dung | Kết quả |
| :--- | :--- |
| Breadcrumb | Đạt |
| Tiêu đề | Đạt |
| Mô tả | Đạt |
| Nút thêm sản phẩm | Đạt |
| Nút làm mới | Đạt |

---

### 2.2. Thống kê món ăn

- Các thông tin tổng số món, món đang kinh doanh, món hết tồn kho và giá trung bình được chia thành các Card riêng.
- Icon giúp phân biệt từng loại thông tin.
- Số liệu được hiển thị lớn, dễ quan sát.
- Màu sắc của từng Card giúp nhận biết trạng thái nhanh.

| Nội dung | Kết quả |
| :--- | :--- |
| Statistic Card | Đạt |
| Hiển thị số liệu | Đạt |
| Icon | Đạt |
| Màu trạng thái | Đạt |
| Bố cục | Đạt |

---

### 2.3. Bộ lọc và tìm kiếm

- Các trạng thái `Tất cả món`, `Đang bán`, `Tạm ngưng`, `Hết hàng` được bố trí trên cùng một khu vực.
- Trạng thái đang chọn được làm nổi bật bằng màu xanh.
- Có ô tìm kiếm nhanh giúp tìm món thuận tiện.
- Có tùy chọn chuyển đổi giữa dạng Grid và List.

| Nội dung | Kết quả |
| :--- | :--- |
| Bộ lọc trạng thái | Đạt |
| Trạng thái Active | Đạt |
| Search Box | Đạt |
| Chuyển đổi Grid/List | Đạt |

---

### 2.4. Product Card

- Hình ảnh món ăn được đặt ở vị trí nổi bật.
- Tên món và giá được hiển thị rõ ràng.
- Mã sản phẩm được hiển thị trên hình ảnh.
- Thông tin tồn kho được đặt phía dưới phần mô tả.
- Trạng thái `Đang bán` được hiển thị bằng Badge.
- Hai thao tác `Sửa` và `Xóa` được đặt ở cuối Card.

| Nội dung | Kết quả |
| :--- | :--- |
| Hình ảnh | Đạt |
| Tên món | Đạt |
| Giá | Đạt |
| Mã sản phẩm | Đạt |
| Tồn kho | Đạt |
| Trạng thái | Đạt |
| Nút sửa | Đạt |
| Nút xóa | Đạt |

---

### 2.5. Màu sắc và Component

- Màu xanh được sử dụng làm màu chủ đạo cho các thao tác chính.
- Màu đỏ được sử dụng cho thao tác xóa.
- Màu xanh lá được sử dụng để thể hiện trạng thái đang kinh doanh.
- Card, Button, Badge và Search Box có thiết kế tương đối đồng nhất.
- Icon được sử dụng phù hợp với từng chức năng.

| Nội dung | Kết quả |
| :--- | :--- |
| Màu chủ đạo | Đạt |
| Màu trạng thái | Đạt |
| Button | Đạt |
| Card | Đạt |
| Badge | Đạt |
| Icon | Đạt |

---

## 3. Đánh giá UX/UI

### 3.1. Bố cục

- Nội dung được sắp xếp theo thứ tự từ tiêu đề → thống kê → bộ lọc → danh sách món.
- Các chức năng chính được đặt ở vị trí dễ nhận biết.
- Product Card có bố cục rõ ràng và dễ theo dõi.
- Khoảng cách giữa các khu vực tương đối hợp lý.

| Nội dung | Kết quả |
| :--- | :--- |
| Layout | Đạt |
| Phân cấp thông tin | Đạt |
| CTA | Đạt |
| UX | Đạt |

### 3.2. Màu sắc

- Giao diện sử dụng nền sáng kết hợp màu xanh làm màu nhấn.
- Màu xanh giúp nhận biết các thao tác chính và trạng thái đang chọn.
- Màu đỏ được sử dụng cho thao tác xóa, giúp phân biệt hành động có tính chất nguy hiểm.
- Tổng thể màu sắc phù hợp với giao diện quản trị.

| Nội dung | Kết quả |
| :--- | :--- |
| Màu nền | Đạt |
| Màu chủ đạo | Đạt |
| Màu trạng thái | Đạt |
| Tính nhất quán | Đạt |

### 3.3. Luồng sử dụng

``text
Truy cập Quản lý món ăn
↓
Xem thống kê món
↓
Tìm kiếm hoặc lọc món
↓
Xem thông tin món
↓
Thêm / Sửa / Xóa món
↓
Làm mới danh sách


## 4. Responsive

- Giao diện được xây dựng theo dạng Dashboard Web với Sidebar cố định và khu vực nội dung chính.
- Khu vực thống kê được chia thành các Card riêng, giúp thông tin dễ quan sát trên màn hình Web.
- Khu vực tìm kiếm và bộ lọc được bố trí trên cùng một hàng, thuận tiện cho thao tác quản lý.
- Product Card sử dụng dạng Grid, các thành phần trong Card được sắp xếp rõ ràng.
- Sidebar có thanh cuộn riêng, giúp người dùng tiếp cận các chức năng quản lý khác mà không ảnh hưởng đến nội dung chính.
- Không ghi nhận lỗi vỡ bố cục nghiêm trọng trên giao diện Web trong quá trình review.
- Khi số lượng sản phẩm tăng, cần đảm bảo Product Grid vẫn giữ được khoảng cách và kích thước Card hợp lý.

| Nội dung | Kết quả |
| :--- | :--- |
| Sidebar | Đạt |
| Header | Đạt |
| Statistic Card | Đạt |
| Search Box | Đạt |
| Bộ lọc | Đạt |
| Product Grid | Đạt |
| Product Card | Đạt |
| Responsive Web | Đạt |

---

## 5. Danh sách Defect

Không ghi nhận Defect về UI/UX trong lần Review này.

Giao diện trang Quản lý món ăn hiện tại đáp ứng tốt các yêu cầu về bố cục, màu sắc, khả năng nhận biết chức năng và tính nhất quán giữa các thành phần.

| Nội dung | Kết quả |
| :--- | :--- |
| Layout | Đạt |
| Sidebar | Đạt |
| Header | Đạt |
| Statistic Card | Đạt |
| Search / Filter | Đạt |
| Product Card | Đạt |
| Button | Đạt |
| Icon | Đạt |
| Màu sắc | Đạt |
| Responsive Web | Đạt |
| Tính nhất quán UI | Đạt |
| Defect | Không có |

---

## 6. Đề xuất cải tiến UI/UX

Các đề xuất dưới đây chỉ mang tính cải thiện giao diện, không phải Defect:

- Có thể sử dụng thêm hiệu ứng Hover nhẹ cho Product Card để giao diện sinh động hơn khi người dùng di chuyển chuột.
- Có thể tăng nhẹ độ tương phản giữa nền trang và Product Card để các khu vực nội dung nổi bật hơn.
- Có thể sử dụng màu xanh chủ đạo nhất quán hơn cho các thành phần tương tác chính.
- Có thể sử dụng màu đỏ ở mức vừa phải cho các thao tác nguy hiểm như `Xóa`, tránh sử dụng quá nhiều màu nổi bật trên cùng một khu vực.
- Có thể bổ sung hiệu ứng chuyển đổi nhẹ khi chuyển giữa các bộ lọc `Tất cả món`, `Đang bán`, `Tạm ngưng`, `Hết hàng`.
- Có thể bổ sung trạng thái Hover cho các Button `Sửa`, `Xóa`, `Thêm sản phẩm` để tăng khả năng nhận biết thao tác.
- Có thể duy trì bo góc và khoảng cách hiện tại vì đang tạo cảm giác hiện đại, phù hợp với giao diện quản trị.
- Nên duy trì cách sử dụng Icon kết hợp với Text vì giúp Admin nhận biết chức năng nhanh hơn.

---

## 7. Kết luận

- Trang Quản lý món ăn có giao diện rõ ràng, hiện đại và phù hợp với hệ thống quản trị nhà hàng.
- Bố cục Sidebar, Header, khu vực thống kê, bộ lọc và danh sách sản phẩm được tổ chức hợp lý.
- Product Card hiển thị đầy đủ các thông tin cần thiết và các thao tác quản lý được đặt ở vị trí dễ nhận biết.
- Màu xanh được sử dụng làm màu chủ đạo cho các thao tác chính, kết hợp với màu đỏ cho thao tác Xóa, tạo được sự phân biệt rõ ràng.
- Các Icon, Button, Card và Badge có tính nhất quán về phong cách.
- Giao diện Web hiện tại không ghi nhận lỗi UI/UX đáng kể.
- Responsive trên giao diện Web đáp ứng yêu cầu kiểm tra.
- Các đề xuất cải tiến chủ yếu nhằm tăng tính thẩm mỹ và tương tác, không bắt buộc phải thay đổi.

**Kết quả Review: Đạt**

| Nội dung | Kết quả |
| :--- | :--- |
| UI/UX | Đạt |
| Layout | Đạt |
| Màu sắc | Đạt |
| Component | Đạt |
| Product Card | Đạt |
| Navigation | Đạt |
| Responsive Web | Đạt |
| Tính nhất quán | Đạt |
| Defect | Không có |
| Kết quả Review | **Đạt** |