# KẾT QUẢ THỰC THI KIỂM THỬ HỘP TRẮNG & CODE COVERAGE (TEST EXECUTION RESULT)

**Dự án:** FutureSushi - Hệ thống Đặt món & Quản lý Nhà hàng Sushi  
**Module kiểm thử:** Category & Product Management (kèm Auth Guard Middleware)  
**Thư mục chứa Test Suite:** `backend/whitebox-tests/`  
**Môi trường kiểm thử:** Node.js v20+, Jest Test Runner v29.7+, Istanbul Engine  
**Thời gian thực thi:** 21/08/2026  
**Người thực hiện / Tester:** Nguyễn Anh Huy  

---

## 1. TỔNG KẾT KẾT QUẢ THỰC THI (EXECUTIVE TEST SUMMARY)

| Chỉ số tổng quan | Giá trị thực tế | Tỷ lệ đạt được | Đánh giá |
| :--- | :---: | :---: | :---: |
| **Tổng số Test Suites** | 3 / 3 Suites | **100% PASS** | Đạt yêu cầu |
| **Tổng số Test Cases** | **48 / 48 Cases** | **100% PASS** | Hoàn hảo |
| **Số Test Case thất bại (Failed)** | 0 Cases | **0%** | Không có lỗi |
| **Thời gian thực thi (Runtime)** | ~1.30 giây | Nhanh / Hiệu quả | Đạt chuẩn |
| **Statements Coverage** | 121 / 121 Statements | **100%** | Xuất sắc |
| **Branches Coverage** | 37 / 37 Branches | **100%** | Xuất sắc |
| **Functions Coverage** | 15 / 15 Functions | **100%** | Xuất sắc |
| **Lines Coverage** | 118 / 118 Lines | **100%** | Xuất sắc |

---

## 2. KẾT QUẢ CHI TIẾT THEO TỪNG TEST SUITE

### 2.1 Test Suite 1: `categoryController.test.js` (15/15 PASS)

- **File kiểm thử:** [`backend/whitebox-tests/categoryController.test.js`](file:///c:/Users/ADMIN/OneDrive%20-%20ut.edu.vn/Backup/Desktop/Clone%20CNPM/clone2/KCPM-2026/backend/whitebox-tests/categoryController.test.js)
- **Đối tượng kiểm thử:** `backend/src/controllers/categoryController.js`
- **Kết quả Coverage:** Statements: 100% | Branches: 100% | Functions: 100% | Lines: 100%

| Test Case ID | Tên Kịch Bản Kiểm Thử | Assertion / Kỳ vọng kiểm tra | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :--- | :---: |
| **WB-CAT-01** | `getAllCategories` không có search & có products | `res.json` trả về list có `productCount` chính xác | Trả về đúng mảng đối tượng | **PASS** |
| **WB-CAT-02** | `getAllCategories` không có search & `products: null` | `productCount` mặc định gán về 0 | `productCount = 0` | **PASS** |
| **WB-CAT-03** | `getAllCategories` có từ khóa search | Gọi `findAll` với `Op.or` theo name và description | Đúng cú pháp query Sequelize | **PASS** |
| **WB-CAT-04** | `getAllCategories` Database exception | `res.status(500)` và trả về `{ message }` | HTTP 500, message lỗi | **PASS** |
| **WB-CAT-05** | `getCategoryById` danh mục tồn tại | `res.json` trả về đối tượng Category | HTTP 200, category JSON | **PASS** |
| **WB-CAT-06** | `getCategoryById` danh mục không tồn tại | `res.status(404)` kèm `{ message: "Not found" }` | HTTP 404 Not Found | **PASS** |
| **WB-CAT-07** | `getCategoryById` DB exception | `res.status(500)` | HTTP 500 | **PASS** |
| **WB-CAT-08** | `createCategory` dữ liệu hợp lệ | `res.status(201)` và trả về đối tượng mới tạo | HTTP 201 Created | **PASS** |
| **WB-CAT-09** | `createCategory` Validation error | `res.status(400)` | HTTP 400 Bad Request | **PASS** |
| **WB-CAT-10** | `updateCategory` thành công (`updated = 1`) | `res.json` trả về đối tượng sau cập nhật | HTTP 200, updated object | **PASS** |
| **WB-CAT-11** | `updateCategory` không tìm thấy ID (`updated = 0`) | `res.status(404)` | HTTP 404 Not Found | **PASS** |
| **WB-CAT-12** | `updateCategory` Lỗi ngoại lệ DB | `res.status(400)` | HTTP 400 Bad Request | **PASS** |
| **WB-CAT-13** | `deleteCategory` thành công (`deleted = 1`) | `res.status(204).send()` | HTTP 204 No Content | **PASS** |
| **WB-CAT-14** | `deleteCategory` không tìm thấy ID (`deleted = 0`) | `res.status(404)` | HTTP 404 Not Found | **PASS** |
| **WB-CAT-15** | `deleteCategory` Lỗi Database/FK | `res.status(500)` | HTTP 500 Server Error | **PASS** |

---

### 2.2 Test Suite 2: `productController.test.js` (16/16 PASS)

- **File kiểm thử:** [`backend/whitebox-tests/productController.test.js`](file:///c:/Users/ADMIN/OneDrive%20-%20ut.edu.vn/Backup/Desktop/Clone%20CNPM/clone2/KCPM-2026/backend/whitebox-tests/productController.test.js)
- **Đối tượng kiểm thử:** `backend/src/controllers/productController.js`
- **Kết quả Coverage:** Statements: 100% | Branches: 100% | Functions: 100% | Lines: 100%

| Test Case ID | Tên Kịch Bản Kiểm Thử | Assertion / Kỳ vọng kiểm tra | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :--- | :---: |
| **WB-PRD-01** | `getAllProducts` không truyền filter | `findAll({ where: {} })`, `status(200)` | HTTP 200, trả về danh sách | **PASS** |
| **WB-PRD-02** | `getAllProducts` lọc theo `category_id` | `where = { category_id: '2' }`, `status(200)` | Lọc chính xác category_id | **PASS** |
| **WB-PRD-03** | `getAllProducts` tìm theo `search` | `where = { name: { [Op.like]: ... } }` | Tìm đúng tên món ăn | **PASS** |
| **WB-PRD-04** | `getAllProducts` kết hợp cả `category_id` & `search` | `where` chứa cả 2 điều kiện lọc | Query kết hợp 2 trường | **PASS** |
| **WB-PRD-05** | `getAllProducts` Database exception | `res.status(500)` | HTTP 500 Server Error | **PASS** |
| **WB-PRD-06** | `getProductById` món ăn tồn tại | `res.status(200)` kèm đối tượng món ăn | HTTP 200 OK | **PASS** |
| **WB-PRD-07** | `getProductById` món ăn không tồn tại | `res.status(404)` kèm `{ message: "Product not found" }` | HTTP 404 Not Found | **PASS** |
| **WB-PRD-08** | `getProductById` DB exception | `res.status(500)` | HTTP 500 Server Error | **PASS** |
| **WB-PRD-09** | `createProduct` tạo món ăn hợp lệ | `res.status(201)` kèm product đã tạo | HTTP 201 Created | **PASS** |
| **WB-PRD-10** | `createProduct` Lỗi validation dữ liệu | `res.status(400)` | HTTP 400 Bad Request | **PASS** |
| **WB-PRD-11** | `updateProduct` cập nhật thành công | `res.status(200)` kèm product cập nhật | HTTP 200 OK | **PASS** |
| **WB-PRD-12** | `updateProduct` không tìm thấy ID (`updated = 0`) | `res.status(404)` | HTTP 404 Not Found | **PASS** |
| **WB-PRD-13** | `updateProduct` lỗi validation/DB | `res.status(400)` | HTTP 400 Bad Request | **PASS** |
| **WB-PRD-14** | `deleteProduct` xóa thành công (`deleted = 1`) | `res.status(204).send()` | HTTP 204 No Content | **PASS** |
| **WB-PRD-15** | `deleteProduct` không tìm thấy ID (`deleted = 0`) | `res.status(404)` | HTTP 404 Not Found | **PASS** |
| **WB-PRD-16** | `deleteProduct` DB exception | `res.status(500)` | HTTP 500 Server Error | **PASS** |

---

### 2.3 Test Suite 3: `authMiddleware.test.js` (17/17 PASS)

- **File kiểm thử:** [`backend/whitebox-tests/authMiddleware.test.js`](file:///c:/Users/ADMIN/OneDrive%20-%20ut.edu.vn/Backup/Desktop/Clone%20CNPM/clone2/KCPM-2026/backend/whitebox-tests/authMiddleware.test.js)
- **Đối tượng kiểm thử:** `backend/src/middlewares/authMiddleware.js`
- **Kết quả Coverage:** Statements: 100% | Branches: 100% | Functions: 100% | Lines: 100%

| Test Case ID | Tên Kịch Bản Kiểm Thử | Assertion / Kỳ vọng kiểm tra | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :--- | :---: |
| **WB-AUTH-01** | `verifyToken` thiếu header | `res.status(401)` | HTTP 401 "No token" | **PASS** |
| **WB-AUTH-02** | `verifyToken` hợp lệ với `JWT_SECRET` | `req.user = decoded`, gọi `next()` | Gán user & gọi next() | **PASS** |
| **WB-AUTH-03** | `verifyToken` hợp lệ với default fallback | `req.user = decoded`, gọi `next()` | Fallback secret hoạt động | **PASS** |
| **WB-AUTH-04** | `verifyToken` token hỏng / hết hạn | `res.status(401)` | HTTP 401 "Invalid token" | **PASS** |
| **WB-AUTH-05** | `optionalVerifyToken` không gửi header | `req.user = null`, gọi `next()` | `user = null`, gọi next() | **PASS** |
| **WB-AUTH-06** | `optionalVerifyToken` token hợp lệ với `JWT_SECRET` | `req.user = decoded`, gọi `next()` | Gán decoded user | **PASS** |
| **WB-AUTH-07** | `optionalVerifyToken` token hợp lệ với fallback | `req.user = decoded`, gọi `next()` | Gán decoded user | **PASS** |
| **WB-AUTH-08** | `optionalVerifyToken` token lỗi | `req.user = null`, gọi `next()` | Không chặn, gán user=null | **PASS** |
| **WB-AUTH-09** | `isAdmin` user có role 'ADMIN' | Gọi `next()` | `next()` được gọi | **PASS** |
| **WB-AUTH-10** | `isAdmin` user có role 'admin' (thường) | Gọi `next()` | `next()` được gọi | **PASS** |
| **WB-AUTH-11** | `isAdmin` user role 'CUSTOMER' | `res.status(403)` | HTTP 403 Access denied | **PASS** |
| **WB-AUTH-12** | `isAdmin` user thiếu thuộc tính role | `res.status(403)` | HTTP 403 Forbidden | **PASS** |
| **WB-AUTH-13** | `isAdmin` user là undefined/null | `res.status(403)` | HTTP 403 Forbidden | **PASS** |
| **WB-AUTH-14** | `isStaffOrAdmin` user role 'ADMIN' | Gọi `next()` | `next()` được gọi | **PASS** |
| **WB-AUTH-15** | `isStaffOrAdmin` user role 'STAFF' | Gọi `next()` | `next()` được gọi | **PASS** |
| **WB-AUTH-16** | `isStaffOrAdmin` user role 'CUSTOMER' | `res.status(403)` | HTTP 403 Forbidden | **PASS** |
| **WB-AUTH-17** | `isStaffOrAdmin` user là undefined | `res.status(403)` | HTTP 403 Forbidden | **PASS** |

---

## 3. LOG MÁY THỰC THI (RAW TEST EXECUTION LOG)

```text
> backend-app-dat-mon@1.0.0 test:coverage
> jest --coverage

PASS whitebox-tests/authMiddleware.test.js
PASS whitebox-tests/categoryController.test.js
PASS whitebox-tests/productController.test.js
------------------------|---------|----------|---------|---------|-------------------
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
------------------------|---------|----------|---------|---------|-------------------
All files               |     100 |      100 |     100 |     100 |                   
 controllers            |     100 |      100 |     100 |     100 |                   
  categoryController.js |     100 |      100 |     100 |     100 |                   
  productController.js  |     100 |      100 |     100 |     100 |                   
 middlewares            |     100 |      100 |     100 |     100 |                   
  authMiddleware.js     |     100 |      100 |     100 |     100 |                   
------------------------|---------|----------|---------|---------|-------------------

=============================== Coverage summary ===============================
Statements   : 100% ( 121/121 )
Branches     : 100% ( 37/37 )
Functions    : 100% ( 15/15 )
Lines        : 100% ( 118/118 )
================================================================================

Test Suites: 3 passed, 3 total
Tests:       48 passed, 48 total
Snapshots:   0 total
Time:        1.301 s
Ran all test suites.
```

---

## 4. TÀI NGUYÊN BÀN GIAO KÈM THEO

- **Thư mục mã nguồn Test:** [`backend/whitebox-tests/`](file:///c:/Users/ADMIN/OneDrive%20-%20ut.edu.vn/Backup/Desktop/Clone%20CNPM/clone2/KCPM-2026/backend/whitebox-tests)
- **File Test Case Excel:** [`docs/testing/WhiteBox/Category_Product/WhiteBox_Category_Product_TestCases.xlsx`](file:///c:/Users/ADMIN/OneDrive%20-%20ut.edu.vn/Backup/Desktop/Clone%20CNPM/clone2/KCPM-2026/docs/testing/WhiteBox/Category_Product/WhiteBox_Category_Product_TestCases.xlsx)
- **Báo cáo HTML trực quan:** [`docs/testing/WhiteBox/Category_Product/WhiteBox_Category_Product_Test_Report.html`](file:///c:/Users/ADMIN/OneDrive%20-%20ut.edu.vn/Backup/Desktop/Clone%20CNPM/clone2/KCPM-2026/docs/testing/WhiteBox/Category_Product/WhiteBox_Category_Product_Test_Report.html)
- **Chứng minh 100% Branch Coverage:** [`docs/testing/WhiteBox/Category_Product/WhiteBox_Branch_Coverage_Proof.md`](file:///c:/Users/ADMIN/OneDrive%20-%20ut.edu.vn/Backup/Desktop/Clone%20CNPM/clone2/KCPM-2026/docs/testing/WhiteBox/Category_Product/WhiteBox_Branch_Coverage_Proof.md)
- **Báo cáo Coverage tự sinh Istanbul:** [`backend/coverage/lcov-report/index.html`](file:///c:/Users/ADMIN/OneDrive%20-%20ut.edu.vn/Backup/Desktop/Clone%20CNPM/clone2/KCPM-2026/backend/coverage/lcov-report/index.html)
