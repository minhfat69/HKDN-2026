# KIỂM THỬ TỰ ĐỘNG CHỨC NĂNG ĐẶT BÀN VÀ ĐÁNH GIÁ

## Mục tiêu

Kiểm thử tự động giao diện khách hàng (Customer UI) của hệ thống FutureSuShi bằng CodeceptJS và Playwright.

Các chức năng được kiểm thử:

- Đặt bàn (Reservation)
- Đánh giá (Review)

---

## Công nghệ sử dụng

- CodeceptJS 4.1.0
- Playwright
- JavaScript

---

# Chức năng đặt bàn (Reservation)

## Các trường hợp kiểm thử

| STT | Trường hợp kiểm thử | Kết quả |
| --- | ------------------- | -------- |
| 1 | Kiểm tra giao diện trang đặt bàn | Pass |
| 2 | Kiểm tra lịch sử đặt bàn khi chưa đăng nhập | Pass |
| 3 | Kiểm tra số lượng khách mặc định | Pass |
| 4 | Kiểm tra danh sách số lượng khách | Pass |
| 5 | Kiểm tra validation khi bỏ trống họ tên | Pass |
| 6 | Kiểm tra validation khi bỏ trống số điện thoại | Pass |
| 7 | Kiểm tra validation khi bỏ trống ngày | Pass |
| 8 | Kiểm tra validation khi bỏ trống giờ | Pass |
| 9 | Kiểm tra ghi chú không bắt buộc | Pass |
| 10 | Kiểm tra nhập đầy đủ thông tin đặt bàn | Pass |
| 11 | Kiểm tra thay đổi số lượng khách | Pass |
| 12 | Kiểm tra nhập ghi chú | Pass |
| 13 | Kiểm tra nút Đặt bàn ngay | Pass |

---

# Chức năng đánh giá (Review)

## Các trường hợp kiểm thử

| STT | Trường hợp kiểm thử | Kết quả |
| --- | ------------------- | -------- |
| 1 | Kiểm tra giao diện trang đánh giá | Pass |
| 2 | Kiểm tra hiển thị đủ 5 ngôi sao | Pass |
| 3 | Kiểm tra đánh giá mặc định là 5 sao | Pass |
| 4 | Kiểm tra chọn 1 sao | Pass |
| 5 | Kiểm tra chọn 3 sao | Pass |
| 6 | Kiểm tra chọn lại 5 sao | Pass |
| 7 | Kiểm tra nhập tiêu đề đánh giá | Pass |
| 8 | Kiểm tra nhập nội dung đánh giá | Pass |
| 9 | Kiểm tra placeholder của form đánh giá | Pass |
| 10 | Kiểm tra nút Gửi đánh giá | Pass |
| 11 | Kiểm tra form đánh giá khi chưa nhập dữ liệu | Pass |
| 12 | Kiểm tra nhập đầy đủ thông tin đánh giá | Pass |
| 13 | Kiểm tra gửi đánh giá khi chưa đăng nhập | Pass |
| 14 | Kiểm tra khu vực danh sách đánh giá | Pass |
| 15 | Kiểm tra thông tin thống kê đánh giá | Pass |
| 16 | Kiểm tra thay đổi nhiều mức đánh giá | Pass |

---

## Kết quả kiểm thử

### Đặt bàn

- Tổng số test case: 13
- Test case thành công: 13
- Test case thất bại: 0

### Đánh giá

- Tổng số test case: 16
- Test case thành công: 16
- Test case thất bại: 0

### Tổng cộng

- Tổng số test case: 29
- Test case thành công: 29
- Test case thất bại: 0

---

## Lệnh thực thi

### Chạy test và hiển thị từng bước

```bash
npx codeceptjs run --steps
```

### Chạy riêng chức năng đặt bàn

```bash
npx codeceptjs run tests/reservation/reservation_test.js --steps
```

### Chạy riêng chức năng đánh giá

```bash
npx codeceptjs run tests/review/review_test.js --steps
```

### Chạy toàn bộ test

```bash
npx codeceptjs run
```

---

## Kết luận

Các chức năng Đặt bàn và Đánh giá của hệ thống FutureSuShi được kiểm thử tự động trên giao diện khách hàng bằng CodeceptJS và Playwright.

### Chức năng Đặt bàn

Kết quả kiểm thử cho thấy:

- Giao diện trang đặt bàn hiển thị đúng.
- Các trường thông tin đặt bàn hoạt động đúng.
- Hệ thống kiểm tra các trường bắt buộc khi bỏ trống.
- Số lượng khách có thể được lựa chọn.
- Trường ghi chú hoạt động đúng.
- Nút Đặt bàn ngay được hiển thị đúng.
- Lịch sử đặt bàn được xử lý phù hợp khi người dùng chưa đăng nhập.
- 13/13 test case Pass.

### Chức năng Đánh giá

Kết quả kiểm thử cho thấy:

- Giao diện trang đánh giá hiển thị đúng.
- Hiển thị đầy đủ 5 ngôi sao.
- Mức đánh giá mặc định là 5 sao.
- Có thể thay đổi mức đánh giá từ 1 đến 5 sao.
- Có thể nhập tiêu đề đánh giá.
- Có thể nhập nội dung đánh giá.
- Placeholder của các trường hiển thị đúng.
- Nút Gửi đánh giá được hiển thị đúng.
- Form đánh giá có trạng thái ban đầu chính xác.
- Hệ thống xử lý đúng trường hợp người dùng chưa đăng nhập.
- Khu vực danh sách đánh giá được hiển thị.
- Thông tin thống kê đánh giá được hiển thị đúng.
- 16/16 test case Pass.

### Tổng kết

- Tổng số test case: 29
- Pass: 29
- Fail: 0

Kết quả kiểm thử cho thấy giao diện các chức năng Đặt bàn và Đánh giá của hệ thống FutureSuShi hoạt động đúng theo các trường hợp kiểm thử đã thiết kế.