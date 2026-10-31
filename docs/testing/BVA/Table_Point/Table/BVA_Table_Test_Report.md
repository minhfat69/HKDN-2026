# FutureSuShi – BVA Table API Test Report

## 1. Mục tiêu
Kiểm thử API quản lý bàn ăn của FutureSuShi bằng Postman, tập trung vào Boundary Value Analysis (BVA) và các trường hợp hợp lệ/không hợp lệ liên quan đến dữ liệu bàn.

## 2. Phạm vi
- Create Table
- Update Table
- Update Table Status
- Delete Table
- Get Table By QR Code
- Get All Tables
- Bulk Create Tables
- Các giá trị biên: `tableNumber = 0`, `capacity = 0`, QR rỗng và các dữ liệu không hợp lệ.

## 3. Bộ test
Tổng cộng: **18 test cases**.

## 4. Kết quả execution gần nhất
- **PASS: 13/18**
- **FAIL: 5/18**

### Các case PASS
- AUTH – Đăng nhập Admin
- TB-002 – Create Duplicate Table
- TB-WB-004 – Update Table Not Found
- TB-WB-005 – Update Table Success
- TB-BVA-005 – Empty QR Code
- TB-WB-009 – Status Table Not Found
- TB-WB-013 – Delete Table Not Found
- TB-WB-017 – QR Not Found
- TB-WB-018 – Get Table By QR
- TB-WB-022 – Get All Tables
- TB-BVA-007 – Active Order
- TB-WB-019 – Body Not Array
- TB-WB-020 – Bulk Create Success

### Các case FAIL cần ghi nhận
| Test case | Expected | Actual | Nhận xét |
|---|---:|---:|---|
| TB-001 – Create Table Success | 201 | 400 | Dữ liệu bàn đã tồn tại tại thời điểm chạy |
| TB-BVA-001 – tableNumber = 0 | 201 | 400 | API từ chối dữ liệu |
| TB-BVA-002 – capacity = 0 | 201 | 400 | API từ chối dữ liệu |
| TB-WB-010 – Update OCCUPIED | 200 | 404 | Request hiện tại không tìm thấy bàn |
| TB-WB-015 – Delete Table Success | 200 | 404 | Bàn dùng cho test không còn tồn tại |

## 5. Đánh giá
Bộ test chạy được trên môi trường local. Các trường hợp 400/404 được giữ lại khi đó là kết quả thực tế của API. Những FAIL được ghi nhận làm vấn đề cần kiểm tra về test data, endpoint/request hoặc dữ liệu trạng thái.

