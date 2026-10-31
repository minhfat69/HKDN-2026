# KIỂM THỬ TỰ ĐỘNG CHỨC NĂNG ĐĂNG NHẬP VÀ ĐĂNG KÝ

## Mục tiêu

Kiểm thử tự động giao diện khách hàng (Customer UI) của hệ thống FutureSuShi bằng CodeceptJS và Playwright.

Các chức năng được kiểm thử:

- Đăng nhập (Login)
- Đăng ký (Register)

---

## Công nghệ sử dụng

- CodeceptJS 4.1.0
- Playwright
- JavaScript

---

# Chức năng đăng nhập (Login)

## Các trường hợp kiểm thử

| STT | Trường hợp kiểm thử | Kết quả |
| --- | ------------------- | -------- |
| 1 | Đăng nhập thành công bằng username | Pass |
| 2 | Đăng nhập với mật khẩu sai | Pass |
| 3 | Bỏ trống tài khoản | Pass |
| 4 | Bỏ trống mật khẩu | Pass |
| 5 | Bỏ trống toàn bộ thông tin | Pass |
| 6 | Đăng nhập với tài khoản không tồn tại | Pass |
| 7 | Đăng nhập bằng số điện thoại | Pass |
| 8 | Đăng nhập bằng email | Pass |

---

# Chức năng đăng ký (Register)

## Các trường hợp kiểm thử

| STT | Trường hợp kiểm thử | Kết quả |
| --- | ------------------- | -------- |
| 1 | Đăng ký thành công | Pass |
| 2 | Bỏ trống toàn bộ thông tin | Pass |
| 3 | Bỏ trống họ và tên | Pass |
| 4 | Bỏ trống số điện thoại | Pass |
| 5 | Bỏ trống username | Pass |
| 6 | Bỏ trống mật khẩu | Pass |
| 7 | Đăng ký với username đã tồn tại | Pass |
| 8 | Đăng ký với số điện thoại đã tồn tại | Pass |

---

## Kết quả kiểm thử

- Tổng số test case: 16
- Test case thành công: 16
- Test case thất bại: 0

---

## Lệnh thực thi

```bash
npx codeceptjs run
```

---

## Kết luận

Các chức năng đăng nhập và đăng ký của hệ thống FutureSuShi hoạt động đúng theo yêu cầu.

Kết quả kiểm thử cho thấy:

- Hệ thống xử lý đúng khi đăng nhập thành công.
- Hệ thống xử lý đúng khi nhập sai mật khẩu.
- Hệ thống xử lý đúng khi bỏ trống thông tin.
- Hệ thống cho phép đăng nhập bằng username, email và số điện thoại.
- Hệ thống kiểm tra dữ liệu trùng lặp khi đăng ký.
- Các thông báo lỗi được hiển thị đúng theo từng trường hợp kiểm thử.