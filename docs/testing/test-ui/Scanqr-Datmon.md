# KIỂM THỬ TỰ ĐỘNG CHỨC NĂNG QUÉT QR VÀ ĐẶT MÓN

## Mục tiêu

Kiểm thử tự động giao diện khách hàng (Customer UI) của hệ thống FutureSuShi bằng CodeceptJS và Playwright.

Các chức năng được kiểm thử:

- Quét mã QR (QR Scan)
- Đặt món (Order)

---

## Công nghệ sử dụng

- CodeceptJS 4.1.0
- Playwright
- JavaScript

---

## Lưu ý

Do quá trình kiểm thử được thực hiện trên thiết bị tablet nên không thể sử dụng camera để quét mã qr trực tiếp.

Vì vậy, chức năng quét QR chỉ được kiểm thử bằng cách nhập đường dẫn (URL) của mã QR đã được tạo trước đó (bàn T5).

Trường hợp quét mã QR bằng camera chưa được kiểm thử trong phạm vi của bài kiểm thử này.

---

# Chức năng quét mã QR (QR Scan)

## Các trường hợp kiểm thử

| STT | Trường hợp kiểm thử | Kết quả |
| --- | ------------------- | -------- |
| 1 | Nhập đúng đường dẫn mã QR của bàn T5 và chuyển đến trang thực đơn | Pass |
| 2 | Nhập đường dẫn QR không hợp lệ | Pass |
| 3 | Không nhập đường dẫn QR | Pass |

---

# Chức năng đặt món (Order)

## Các trường hợp kiểm thử

| STT | Trường hợp kiểm thử | Kết quả |
| --- | ------------------- | -------- |
| 1 | Khách thêm một món vào giỏ hàng | Pass |
| 2 | Khách thêm nhiều món vào giỏ hàng | Pass |
| 3 | Khách tăng số lượng món ăn | Pass |
| 4 | Khách giảm số lượng món ăn | Pass |
| 5 | Khách đặt món khi giỏ hàng trống | Pass |
| 6 | Người dùng đăng nhập và đặt món thành công | Pass |

---

## Kết quả kiểm thử

- Tổng số test case: 9
- Test case thành công: 9
- Test case thất bại: 0

---

## Kết luận

Các chức năng quét mã QR và đặt món của hệ thống FutureSuShi hoạt động đúng theo yêu cầu.

Kết quả kiểm thử cho thấy:

- Hệ thống cho phép người dùng truy cập thực đơn thông qua đường dẫn của mã QR.
- Hệ thống xử lý đúng khi người dùng nhập sai đường dẫn QR.
- Hệ thống xử lý đúng khi người dùng không nhập đường dẫn QR.
- Hệ thống cho phép thêm món ăn vào giỏ hàng.
- Hệ thống cho phép tăng và giảm số lượng món ăn.
- Hệ thống xử lý đúng khi giỏ hàng trống.
- Hệ thống cho phép người dùng đã đăng nhập đặt món thành công.

Trong tương lai, cần bổ sung kiểm thử chức năng quét mã QR trực tiếp bằng camera trên thiết bị di động.