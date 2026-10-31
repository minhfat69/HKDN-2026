# Formal Category API Test Cases (Postman Level)

## Module

Quản lý Danh mục món ăn (Category API Management - `/api/categories`)

## Phạm vi kiểm thử

Kiểm thử toàn diện ở mức độ **REST API / Postman** (Không bao gồm giao diện UX/UI):
- **POST `/api/categories`**: Tạo danh mục mới (Positive, Mandatory fields, Boundary length, Special Unicode/Emoji, Input Validations, Auth/RBAC, SQLi & XSS Payload resilience).
- **GET `/api/categories`**: Lấy danh sách toàn bộ danh mục, tìm kiếm theo từ khóa (`?search=`), kiểm tra tính toàn vẹn `productCount`, xử lý Empty state & URL encoded chars.
- **GET `/api/categories/:id`**: Lấy chi tiết danh mục theo ID, xử lý ID không tồn tại (404), ID âm, ID chuỗi (400/404), ID vượt ngưỡng BIGINT.
- **PUT `/api/categories/:id`**: Cập nhật thông tin danh mục, cập nhật từng phần, gỡ bỏ ảnh (`null`), validation dữ liệu, quyền Admin/Customer/Staff/Kitchen.
- **DELETE `/api/categories/:id`**: Xóa danh mục rỗng (204 No Content), kiểm tra ràng buộc khóa ngoại khi có món ăn liên kết (`productCount > 0`), xử lý Double Delete, bảo vệ phân quyền Admin.

## Quy chuẩn Formal Test Case

Mỗi Test Case được đặc tả chuẩn mực gồm các trường:
- ◼ **Test Case ID\***
- ◼ **Test Summary / Description\***
- ◼ **Pre-condition**
- ◼ **Test Steps\***
- ◼ **Inputs (Test Data / Method / Headers / Payload)\***
- ◼ **Expected Result\* (HTTP Status Code, Response Body, Database state)**
- ◼ **Pass / Fail\***

## Tổng số Test Case

**46 Test Cases** (Đặc tả chi tiết trong file [`Category_CRUD_Test_Design.md`](./Category_CRUD_Test_Design.md) và bảng tính Excel [`Category_API_TestCases.xlsx`](./Category_API_TestCases.xlsx)).

## Người thực hiện

Nguyễn Anh Huy

## Jira Ticket

SCRUM-29
