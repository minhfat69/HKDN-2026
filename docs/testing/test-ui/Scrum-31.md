# BIÊN BẢN TỔNG KIỂM THỬ CHỨC NĂNG KHÁCH HÀNG (CUSTOMER UI)

| Thông tin | Chi tiết |
| :--- | :--- |
| Dự án | FutureSuShi |
| Module | Customer UI |
| Hình thức kiểm thử | Kiểm thử tự động (Automation Testing) |
| Công cụ | CodeceptJS |
| Người thực hiện | Nguyễn Phước Thịnh |
| Ngày thực hiện | 19/08/2026 |
| Kết quả | Hoàn thành |

---

# 1. Mục tiêu kiểm thử

- Kiểm thử chức năng Đăng nhập.
- Kiểm thử chức năng Đăng ký.
- Kiểm thử chức năng Quét QR.
- Kiểm thử chức năng Đặt món.
- Kiểm thử chức năng Đặt bàn.
- Kiểm thử chức năng Đánh giá.
- Phát hiện lỗi và ghi nhận các vấn đề cần cải thiện.

---

# 2. Môi trường kiểm thử

| Thành phần | Thông tin |
| :--- | :--- |
| Hệ điều hành | Windows 10 |
| Trình duyệt | Google Chrome |
| Công cụ kiểm thử | CodeceptJS |
| Máy chủ | Localhost |
| Hình thức kiểm thử | Automated UI Testing |

---

# 3. Kết quả kiểm thử

## 3.1. Chức năng Đăng nhập (Login)

| STT | Trường hợp kiểm thử | Kết quả |
| :--- | :--- | :--- |
| 1 | Đăng nhập thành công bằng Username | Pass |
| 2 | Đăng nhập với mật khẩu sai | Pass |
| 3 | Bỏ trống Username | Pass |
| 4 | Bỏ trống mật khẩu | Pass |
| 5 | Bỏ trống toàn bộ thông tin | Pass |
| 6 | Đăng nhập bằng tài khoản không tồn tại | Pass |
| 7 | Đăng nhập bằng số điện thoại | Pass |
| 8 | Đăng nhập bằng Email | Pass |

**Tổng số Test Case:** 8

**Pass:** 8

**Fail:** 0

---

## 3.2. Chức năng Đăng ký (Register)

| STT | Trường hợp kiểm thử | Kết quả |
| :--- | :--- | :--- |
| 1 | Đăng ký thành công | Pass |
| 2 | Bỏ trống toàn bộ thông tin | Pass |
| 3 | Bỏ trống họ và tên | Pass |
| 4 | Bỏ trống số điện thoại | Pass |
| 5 | Bỏ trống Username | Pass |
| 6 | Bỏ trống mật khẩu | Pass |
| 7 | Đăng ký với Username đã tồn tại | Pass |
| 8 | Đăng ký với số điện thoại đã tồn tại | Pass |

**Tổng số Test Case:** 8

**Pass:** 8

**Fail:** 0

---

## 3.3. Chức năng Quét QR (QR Scanner)

| STT | Trường hợp kiểm thử | Kết quả |
| :--- | :--- | :--- |
| 1 | Nhập đúng đường dẫn QR của bàn T5 và chuyển đến trang thực đơn | Pass |
| 2 | Nhập đường dẫn QR không hợp lệ | Pass |
| 3 | Không nhập đường dẫn QR | Pass |

**Tổng số Test Case:** 3

**Pass:** 3

**Fail:** 0

---

## 3.4. Chức năng Đặt món (Order)

| STT | Trường hợp kiểm thử | Kết quả |
| :--- | :--- | :--- |
| 1 | Thêm một món ăn vào giỏ hàng | Pass |
| 2 | Thêm nhiều món ăn vào giỏ hàng | Pass |
| 3 | Tăng số lượng món ăn | Pass |
| 4 | Giảm số lượng món ăn | Pass |
| 5 | Xóa món ăn khỏi giỏ hàng | Pass |
| 6 | Kiểm tra giỏ hàng khi chưa có món ăn | Pass |
| 7 | Đặt món khi chưa đăng nhập | Pass |
| 8 | Đăng nhập và đặt món thành công | Pass |

**Tổng số Test Case:** 8

**Pass:** 8

**Fail:** 0

---

## 3.5. Chức năng Đặt bàn (Booking)

| STT | Trường hợp kiểm thử | Kết quả |
| :--- | :--- | :--- |
| 1 | Kiểm tra giao diện trang đặt bàn | Pass |
| 2 | Kiểm tra lịch sử đặt bàn khi chưa đăng nhập | Pass |
| 3 | Kiểm tra số lượng khách mặc định | Pass |
| 4 | Kiểm tra danh sách số lượng khách | Pass |
| 5 | Bỏ trống họ và tên | Pass |
| 6 | Bỏ trống số điện thoại | Pass |
| 7 | Bỏ trống ngày đặt bàn | Pass |
| 8 | Bỏ trống giờ đặt bàn | Pass |
| 9 | Kiểm tra ghi chú không bắt buộc | Pass |
| 10 | Nhập đầy đủ thông tin đặt bàn | Pass |
| 11 | Thay đổi số lượng khách | Pass |
| 12 | Nhập ghi chú | Pass |
| 13 | Kiểm tra nút Đặt bàn ngay | Pass |

**Tổng số Test Case:** 13

**Pass:** 13

**Fail:** 0

---

## 3.6. Chức năng Đánh giá (Review)

| STT | Trường hợp kiểm thử | Kết quả |
| :--- | :--- | :--- |
| 1 | Kiểm tra giao diện trang đánh giá | Pass |
| 2 | Kiểm tra hiển thị đủ 5 ngôi sao | Pass |
| 3 | Kiểm tra mặc định 5 sao | Pass |
| 4 | Chọn 1 sao | Pass |
| 5 | Chọn 3 sao | Pass |
| 6 | Chọn lại 5 sao | Pass |
| 7 | Nhập tiêu đề đánh giá | Pass |
| 8 | Nhập nội dung đánh giá | Pass |
| 9 | Kiểm tra Placeholder | Pass |
| 10 | Kiểm tra nút Gửi đánh giá | Pass |
| 11 | Kiểm tra Form khi chưa nhập dữ liệu | Pass |
| 12 | Nhập đầy đủ thông tin đánh giá | Pass |
| 13 | Gửi đánh giá khi chưa đăng nhập | Pass |
| 14 | Kiểm tra danh sách đánh giá | Pass |
| 15 | Kiểm tra thống kê đánh giá | Pass |
| 16 | Thay đổi nhiều mức đánh giá | Pass |

**Tổng số Test Case:** 16

**Pass:** 16

**Fail:** 0

---

# 4. Hạn chế trong quá trình kiểm thử

- Chức năng quét mã QR trực tiếp bằng camera chưa thể kiểm thử.
- Quá trình kiểm thử được thực hiện trên môi trường Localhost.
- Việc kiểm thử QR chỉ được thực hiện thông qua việc nhập đường dẫn của mã QR.
- Chưa kiểm thử được khả năng nhận diện mã QR bằng camera trên thiết bị thực tế.
- Chưa thực hiện kiểm thử hiệu năng khi có nhiều người dùng đồng thời.
- Chưa kiểm thử trên nhiều trình duyệt khác nhau.

---

# 5. Các vấn đề phát hiện và đề xuất cải thiện

| Nội dung | Đề xuất |
| :--- | :--- |
| Chức năng QR | Kiểm thử bổ sung trên thiết bị có camera |
| Chức năng đặt món | Bổ sung thêm các trường hợp kiểm thử dữ liệu bất thường |
| Chức năng đặt bàn | Bổ sung kiểm thử ngày và giờ không hợp lệ |
| Chức năng đánh giá | Bổ sung kiểm thử đánh giá với dữ liệu quá dài |
| Hệ thống | Kiểm thử trên nhiều trình duyệt khác nhau |
| Hiệu năng | Bổ sung kiểm thử tải (Load Testing) |


---

# 6. Thống kê tổng hợp

| Chức năng | Test Case | Pass | Fail |
| :--- | :---: | :---: | :---: |
| Đăng nhập | 8 | 8 | 0 |
| Đăng ký | 8 | 8 | 0 |
| Quét QR | 3 | 3 | 0 |
| Đặt món | 8 | 8 | 0 |
| Đặt bàn | 13 | 13 | 0 |
| Đánh giá | 16 | 16 | 0 |
| **Tổng cộng** | **56** | **56** | **0** |

---

# 7. Kết luận

- Tất cả các Test Case đều thực thi thành công.
- Chưa phát hiện lỗi nghiêm trọng ảnh hưởng đến chức năng của hệ thống.
- Các chức năng Đăng nhập, Đăng ký, Quét QR, Đặt món, Đặt bàn và Đánh giá hoạt động đúng theo yêu cầu.
- Chức năng quét QR bằng camera chưa thể kiểm thử trên thiết bị thực tế nên cần được kiểm tra bổ sung trong giai đoạn tiếp theo.
- Hệ thống cần được mở rộng thêm các trường hợp kiểm thử để tăng độ bao phủ và phát hiện thêm các lỗi tiềm ẩn trước khi triển khai chính thức.