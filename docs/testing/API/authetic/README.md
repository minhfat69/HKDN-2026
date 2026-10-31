# Formal Authentication & User API Test Cases (Postman Level)

## Module

Xác thực & Quản lý Người dùng (Authentication & User API Management - `/api/auth` & `/api/users`)

## Phạm vi kiểm thử

Kiểm thử toàn diện ở mức độ **REST API / Postman** (Không bao gồm giao diện UX/UI):
- **POST `/api/auth/register`**: Đăng ký tài khoản người dùng mới (Positive, Mandatory fields, Boundary username length, Unicode/Emoji, Input Validations, Duplicate Username/Phone/Email, Mass Assignment, SQL Injection & XSS Payload resilience).
- **POST `/api/auth/login`**: Xác thực đăng nhập qua đa kênh (Username, Số điện thoại, Email), kiểm tra phân biệt chữ hoa thường, tài khoản không tồn tại, sai mật khẩu, tài khoản bị khóa `status: BLOCKED`, kiểm tra rò rỉ hash mật khẩu trong Response, SQLi & XSS resilience.
- **GET `/api/auth/test`**: Kiểm tra tính sẵn sàng (Health Check) của Router Auth và xử lý Method không hợp lệ.
- **JWT Verification**: Kiểm tra cơ chế xác thực Token (Bearer Token hợp lệ, không có Token, Token thiếu tiền tố Bearer, Token hết hạn, Token giả mạo chữ ký, Token bị sửa đổi Payload, Token rỗng).
- **Phân quyền (RBAC) & Profile**: Kiểm tra phân quyền truy cập theo vai trò (ADMIN, STAFF, CUSTOMER, KITCHEN) và cập nhật thông tin cá nhân qua `/api/users/profile`.

## Quy chuẩn Formal Test Case

Mỗi Test Case được đặc tả chuẩn mực gồm các trường:
- ◼ **Test Case ID\***
- ◼ **Test Summary / Description\***
- ◼ **Pre-condition**
- ◼ **Test Steps\***
- ◼ **Inputs (Test Data / Method / Headers / Payload)\***
- ◼ **Expected Result\* (HTTP Status Code, Response Body, Database state)**
- ◼ **Pass / Fail\***
- ◼ **Thời gian phản hồi (ms)**
- ◼ **HTTP Method & Endpoint**

## Tổng số Test Case

**50 Test Cases** (Đặc tả chi tiết trong file [`Authentication_API_Test_Design.md`](./Authentication_API_Test_Design.md) và bảng tính Excel [`Authentication_API_TestCases.xlsx`](./Authentication_API_TestCases.xlsx), kết quả thực thi tại [`Authentication_API_TestCases_Result.xlsx`](./Authentication_API_TestCases_Result.xlsx)).

## Danh sách tệp bàn giao

1. [`Authentication_API_Postman_Collection.json`](./Authentication_API_Postman_Collection.json): Bộ sưu tập Postman Collection v2.1 chứa toàn bộ các kịch bản kiểm thử tự động.
2. [`FutureSushi - Authentication API Test Suite.postman_test_run.json`](./FutureSushi%20-%20Authentication%20API%20Test%20Suite.postman_test_run.json): File log kết quả chạy Runner từ Postman / Newman.
3. [`Authentication_API_TestCases.xlsx`](./Authentication_API_TestCases.xlsx): Bảng đặc tả chi tiết 50 Test Cases định dạng Excel.
4. [`Authentication_API_TestCases_Result.xlsx`](./Authentication_API_TestCases_Result.xlsx): Bảng kết quả thực thi kiểm thử kèm Dashboard Summary định dạng Excel.
5. [`Authentication_API_Test_Design.md`](./Authentication_API_Test_Design.md): Báo cáo kiểm thử tổng quan, phân tích lỗi (Defects) và bảng đặc tả Markdown.

## Người thực hiện

Nguyễn Anh Huy

## Jira Ticket

SCRUM-10 / SCRUM-13
