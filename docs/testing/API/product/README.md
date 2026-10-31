# Formal Product & Upload API Test Cases (Postman Level)

## Module

Quản lý Món ăn & Upload ảnh (Product / Dish CRUD & Image Upload API - `/api/products` & `/api/upload`)

## Phạm vi kiểm thử

Kiểm thử toàn diện ở mức độ **REST API / Postman** (Không bao gồm giao diện UX/UI):
- **POST `/api/products`**: Tạo món ăn mới (Positive, Mandatory fields: `name`, `price`, `category_id`, Boundary length 150 chars, Special Unicode/Emoji, Decimal price, Internal uploaded image link, Input Validations, Auth/RBAC, SQLi & XSS Payload resilience).
- **GET `/api/products`**: Lấy danh sách toàn bộ món ăn, lọc theo danh mục (`?category_id=`), tìm kiếm theo từ khóa (`?search=`), kết hợp đa điều kiện (`?category_id=1&search=...`), xử lý Empty state, Case-insensitivity & URL encoded chars, kiểm tra schema.
- **GET `/api/products/:id`**: Lấy chi tiết món ăn theo ID, xử lý ID không tồn tại (404), ID số âm, ID chuỗi ký tự (400/404), ID vượt ngưỡng BIGINT.
- **PUT `/api/products/:id`**: Cập nhật thông tin món ăn, cập nhật từng phần (`name`, `price`, `category_id`, `stock`, `isAvailable`), gỡ bỏ ảnh (`null`), validation dữ liệu (chuỗi rỗng, giá âm, category không tồn tại), quyền Admin/Customer/Staff/Kitchen.
- **DELETE `/api/products/:id`**: Xóa món ăn hợp lệ không bị ràng buộc (204 No Content), kiểm tra ràng buộc toàn vẹn khóa ngoại khi có liên kết đơn hàng / giỏ hàng (`OrderItem` / `CartItem`), xử lý Double Delete, bảo vệ phân quyền Admin.
- **POST `/api/upload/image`**: Upload hình ảnh món ăn dạng Multipart/form-data, hỗ trợ các định dạng JPG/JPEG, PNG, WEBP, kiểm tra validation không đính kèm file, sai field name, file không phải ảnh (.sh, .exe, .txt), kiểm soát dung lượng tối đa và bảo vệ phân quyền Admin.

## Quy chuẩn Formal Test Case

Mỗi Test Case được đặc tả chuẩn mực gồm các trường:
- ◼ **Test Case ID\***
- ◼ **Test Summary / Description\***
- ◼ **Pre-condition**
- ◼ **Test Steps\***
- ◼ **Inputs (Test Data / Method / Headers / Payload)\***
- ◼ **Expected Result\* (HTTP Status Code, Response Body, Database state)**
- ◼ **Actual Result (Kết quả thực tế)\***
- ◼ **Pass / Fail\***

## Tổng số Test Case

**66 Test Cases** (Đặc tả chi tiết trong file [`Product_CRUD_and_Upload_Test_Design.md`](./Product_CRUD_and_Upload_Test_Design.md) và các bảng tính Excel [`Product_API_TestCases.xlsx`](./Product_API_TestCases.xlsx), [`Product_API_TestCases_Result.xlsx`](./Product_API_TestCases_Result.xlsx)).

## Người thực hiện

Nguyễn Anh Huy

## Jira Ticket

SCRUM-30
