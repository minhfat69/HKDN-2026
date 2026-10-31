## [UI Review] Customer - Trang chủ index.html

| Thông tin | Chi tiết |
| :--- | :--- |
| Module | Customer - Trang chủ |
| File | index.html |
| Phạm vi | Toàn bộ giao diện từ Header đến Footer |
| Loại Review | UI/UX Review - Lần 2 |
| Người thực hiện | Nguyễn Phước Thịnh |
| Ngày xử lý | 10/08/2026 |
| Kết quả | Cần cải thiện |

## 1. Mục tiêu Review

- Kiểm tra bố cục và tính nhất quán của giao diện.
- Kiểm tra luồng điều hướng giữa các màn hình.
- Kiểm tra UX/UI, màu sắc, icon và component.
- Kiểm tra các vấn đề hiển thị và hình ảnh.
- Ghi nhận Defect và đề xuất cải tiến UI/UX.

## 2. Kết quả Review

### 2.1. Header và Navigation

- Logo và tên thương hiệu FutureSuShi được đặt rõ ràng ở bên trái.
- Menu gồm: Trang chủ, Thực đơn, Đặt bàn, Đánh giá, Giới thiệu, Liên hệ.
- Trang hiện tại được đánh dấu bằng class active.
- Các liên kết trong menu dẫn đến các trang tương ứng.
- Khu vực tài khoản hiển thị tên người dùng và thay đổi giữa Đăng nhập/Đăng xuất.

| Nội dung | Kết quả |
| :--- | :--- |
| Header | Đạt |
| Navigation | Đạt |
| User Account | Đạt |

### 2.2. Hero Section

- Tiêu đề chính nổi bật.
- Phần mô tả ngắn gọn, dễ đọc.
- Hai CTA Đặt món ngay và Đặt bàn được đặt ở vị trí dễ nhìn.
- Card 4.9/5 và 100+ tạo điểm nhấn cho khu vực đầu trang.
- Hình ảnh Hero không tải được.

| Nội dung | Chi tiết |
| :--- | :--- |
| Defect ID | DEF-UI-CUS-001 |
| Expected | Hình ảnh Hero hiển thị đầy đủ và đúng vị trí |
| Actual | Xuất hiện biểu tượng hình ảnh lỗi |
| Severity | Major |
| Priority | High |
| Nguyên nhân cần kiểm tra | ./assets/images/hero.png |

### 2.3. Feature Section

- Món ăn chất lượng
- Quét QR
- Đặt bàn Online
- Đánh giá trực tuyến
- Bố cục các card đồng đều.
- Icon phù hợp với nội dung.
- Tiêu đề và mô tả dễ đọc.
- Khoảng cách giữa các card tương đối hợp lý.

| Nội dung | Kết quả |
| :--- | :--- |
| Component | Đạt |
| Icon | Đạt |
| Layout | Đạt |

## 3. Đánh giá UX/UI

### 3.1. Bố cục

- Các section được phân chia rõ ràng từ phần giới thiệu thương hiệu đến khu vực đặt bàn và Footer.
- Luồng nội dung đi từ giới thiệu → tính năng → giới thiệu nhà hàng → món ăn nổi bật → đặt bàn.
- Các nội dung chính được sắp xếp theo thứ tự hợp lý, giúp người dùng dễ theo dõi.
- Các CTA chính như `Đặt món ngay`, `Đặt bàn` và `Xem thêm` được đặt tại những vị trí dễ nhận biết.
- Bố cục tổng thể tạo được điểm nhấn ở khu vực Hero và các món ăn nổi bật.

| Nội dung | Kết quả |
| :--- | :--- |
| Bố cục | Đạt |
| Phân chia Section | Đạt |
| Luồng nội dung | Đạt |
| CTA | Đạt |
| UX | Đạt |

### 3.2. Màu sắc

- Nền tối được sử dụng xuyên suốt trang.
- Màu xanh được sử dụng làm màu nhấn cho button, icon và trạng thái đang chọn.
- Màu đỏ xuất hiện ở logo và một số thành phần nhận diện thương hiệu.
- Màu trắng được sử dụng cho tiêu đề và nội dung chính, tạo độ tương phản tốt với nền tối.
- Tổng thể màu sắc phù hợp với phong cách hiện đại của website.

| Nội dung | Kết quả |
| :--- | :--- |
| Màu nền | Đạt |
| Màu chữ | Đạt |
| Màu nhấn | Đạt |
| Tính nhất quán | Cần cải thiện |

### 3.3. Icon và Component

- Các icon được sử dụng phù hợp với chức năng của từng khu vực.
- Các Button có thiết kế tương đối thống nhất.
- Các Card trong phần tính năng và món ăn có cách trình bày tương đối đồng đều.
- Navigation và các thành phần tương tác được bố trí rõ ràng.
- Các component có cách bo góc và phong cách thiết kế tương đối thống nhất.

| Nội dung | Kết quả |
| :--- | :--- |
| Icon | Đạt |
| Button | Đạt |
| Card | Đạt |
| Navigation | Đạt |
| Component | Đạt |
| Tính nhất quán | Đạt |

### 3.4. Nội dung và khả năng sử dụng

- Tiêu đề Hero giúp người dùng nhanh chóng nhận biết thương hiệu và nội dung chính của trang.
- Các đoạn mô tả được trình bày ngắn gọn, dễ đọc.
- Các CTA giúp người dùng nhanh chóng chuyển đến các chức năng chính như đặt món và đặt bàn.
- Các section được sắp xếp theo hướng giới thiệu thông tin trước, sau đó đưa người dùng đến các thao tác chính.
- Một số tiêu đề vẫn sử dụng tiếng Anh như `WHY CHOOSE US`, `ABOUT FUTURESUSHI`, `BEST SELLER` và `Customer Rating`.
- Việc kết hợp tiếng Việt và tiếng Anh chưa hoàn toàn thống nhất trên toàn bộ trang.

| Nội dung | Kết quả |
| :--- | :--- |
| Nội dung Hero | Đạt |
| Mô tả | Đạt |
| CTA | Đạt |
| Khả năng sử dụng | Đạt |
| Tính thống nhất ngôn ngữ | Cần cải thiện |

## 4. Danh sách Defect

| Mã lỗi | Nội dung | Mức độ | Độ ưu tiên | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| DEF-UI-CUS-001 | Hình ảnh Hero không hiển thị | Nghiêm trọng | Cao | Đang xử lý |
| DEF-UI-CUS-002 | Hình ảnh món ăn không hiển thị | Nghiêm trọng | Cao | Đang xử lý |
| DEF-UI-CUS-003 | Liên kết mạng xã hội chưa được cấu hình | Nhẹ | Thấp | Đang xử lý |

### DEF-UI-CUS-001 - Hình ảnh Hero không hiển thị

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-001 |
| Kết quả mong đợi | Hình ảnh Hero hiển thị đầy đủ và đúng vị trí trên trang chủ. |
| Kết quả thực tế | Hình ảnh Hero không hiển thị, xuất hiện biểu tượng hình ảnh bị lỗi. |
| Mức độ | Nghiêm trọng |
| Độ ưu tiên | Cao |
| Ảnh hưởng | Làm mất hình ảnh chính của trang và ảnh hưởng đến phần giới thiệu thương hiệu. |
| Đề xuất | Kiểm tra lại đường dẫn và tài nguyên hình ảnh được sử dụng trong khu vực Hero. |

### DEF-UI-CUS-002 - Hình ảnh món ăn không hiển thị

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-002 |
| Kết quả mong đợi | Các món ăn nổi bật hiển thị đầy đủ hình ảnh tương ứng. |
| Kết quả thực tế | Hình ảnh của các món ăn không hiển thị trên giao diện. |
| Mức độ | Nghiêm trọng |
| Độ ưu tiên | Cao |
| Ảnh hưởng | Làm giảm khả năng nhận biết món ăn và ảnh hưởng đến tính trực quan của khu vực món nổi bật. |
| Đề xuất | Kiểm tra lại tài nguyên hình ảnh và đảm bảo hình ảnh món ăn được tải đúng trên giao diện. |

### DEF-UI-CUS-003 - Liên kết mạng xã hội chưa được cấu hình

| Thông tin | Chi tiết |
| :--- | :--- |
| Mã lỗi | DEF-UI-CUS-003 |
| Kết quả mong đợi | Các biểu tượng mạng xã hội dẫn đến đúng trang mạng xã hội tương ứng. |
| Kết quả thực tế | Các liên kết mạng xã hội hiện đang sử dụng `href="#"` và chưa dẫn đến trang cụ thể. |
| Mức độ | Nhẹ |
| Độ ưu tiên | Thấp |
| Ảnh hưởng | Người dùng không thể truy cập trực tiếp vào các trang mạng xã hội của nhà hàng. |
| Đề xuất | Cập nhật liên kết thực tế cho từng biểu tượng mạng xã hội. |

## 5. Đề xuất cải tiến UI/UX

- Sửa các đường dẫn hình ảnh không hiển thị.
- Bổ sung alt cho hình ảnh Hero và hình ảnh món ăn.
- Thay href="#" bằng link mạng xã hội thực tế.
- Thống nhất cách sử dụng tiếng Việt và tiếng Anh.
- Kiểm tra Responsive trên Desktop, Tablet và Mobile.
- Đưa style inline của CTA vào CSS chung.

## 6. Kết luận

- Trang chủ có bố cục rõ ràng và điều hướng dễ sử dụng.
- Các component và màu sắc tương đối thống nhất.
- Cần ưu tiên xử lý DEF-UI-CUS-001 và DEF-UI-CUS-002.
- Cần kiểm tra thêm Responsive trên Mobile và Tablet.

| Nội dung | Kết quả |
| :--- | :--- |
| UI/UX | Đạt |
| Navigation | Đạt |
| Component | Đạt |
| Màu sắc | Đạt |
| Hình ảnh | Không đạt |
| Responsive | Chưa hoàn thành |
| Kết quả Review | Cần cải thiện |