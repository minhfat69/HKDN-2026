# FutureSushi – BVA Point API Test Report

## 1. Mục tiêu
Kiểm thử API tích điểm thủ công cho khách hàng bằng phương pháp Boundary Value Analysis (BVA), tập trung vào `phone` và `orderId`.

## 2. API được kiểm thử
- Method: `POST`
- Endpoint: `/api/points/add-points`
- Base URL: `http://localhost:3000`
- Chức năng: tích điểm cho khách hàng dựa trên hóa đơn.

## 3. Phạm vi
Kiểm tra các trường hợp `phone` thiếu/rỗng/null; `orderId` thiếu, 0, -1, null, sai kiểu và dữ liệu hợp lệ.

## 4. Kết quả thực thi
- Iterations: 1
- Tổng assertions: 19
- Passed: 11
- Failed: 8
- Skipped: 0
- Errors: 0
- Pass rate: 57.89%
- Fail rate: 42.11%
- Duration: 1.564 s
- Average response time: 4 ms

## 5. Kết quả testcase

| Test case | Expected | Actual | Kết quả |
|---|---:|---:|---|
| POINT-001 – phone thiếu | 400 | 404 | FAIL |
| POINT-002 – phone rỗng | 400 | 404 | FAIL |
| POINT-003 – phone null | 400 | 404 | FAIL |
| POINT-004 – orderId thiếu | 400 | 404 | FAIL |
| POINT-005 – orderId = 0 | 400 | 404 | FAIL |
| POINT-006 – orderId = -1 | 404 | 404 | PASS |
| POINT-007 – orderId = null | 400 | 404 | FAIL |
| POINT-008 – orderId = "abc" | 404 | 404 | PASS |
| POINT-009 – dữ liệu hợp lệ | 200 | 404 | FAIL |

## 6. Phân tích
Hai testcase đạt expected là POINT-006 và POINT-008. Các testcase còn lại trả HTTP 404 trong khi assertion yêu cầu mã trạng thái khác. Đây là các trường hợp cần nhóm đối chiếu với đặc tả API và kiểm tra route/middleware/controller.

Test đăng nhập Admin trong lượt chạy trả 400 thay vì 200/201.

## 7. Hiệu năng
Các assertion về response time trong lượt chạy đều PASS với ngưỡng `< 1000ms`. Average response time của run là khoảng 4ms.

## 8. Kết luận
Lượt chạy có 11/19 assertions PASS (57.89%) và 8/19 FAIL (42.11%). Không có skipped test hoặc runner error. Kết quả FAIL được giữ nguyên theo thực tế, không chỉnh source code hoặc expected để tăng tỷ lệ PASS.

## 9. Kiến nghị
1. Kiểm tra cấu hình/authentication khi chạy collection.
2. Kiểm tra route và middleware của `/api/points/add-points`.
3. Đối chiếu expected status code với đặc tả API của nhóm.
4. Sau khi xử lý lỗi, chạy regression lại toàn bộ Point BVA.
