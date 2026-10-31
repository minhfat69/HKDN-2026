# BÁO CÁO KIỂM THỬ HỘP TRẮNG (WHITE-BOX TESTING) & ĐỘ BAO PHỦ MÃ NGUỒN (CODE COVERAGE)

**Học phần:** Kiểm chứng và Đảm bảo Chất lượng Phần mềm (KCPM)  
**Dự án:** FutureSushi - Hệ thống Đặt món & Quản lý Nhà hàng Sushi  
**Module phụ trách:** Quản lý Danh mục & Món ăn (Category & Product Management)  
**Người thực hiện:** Nguyễn Anh Huy  
**Công cụ kiểm thử:** Jest Framework v29.7+, Istanbul Code Coverage Reporter  
**Ngày thực hiện:** 21/08/2026  

---

## 1. TỔNG QUAN VÀ MỤC TIÊU KIỂM THỬ

### 1.1 Mục tiêu
- Kiểm thử cấu trúc nội bộ mã nguồn (White-Box Testing / Structural Testing) cho toàn bộ các hàm điều khiển và middleware thuộc module **Category & Product**.
- Đảm bảo kiểm tra toàn diện tất cả các nhánh rẽ điều kiện (Branch Coverage), câu lệnh (Statement Coverage), hàm/phương thức (Function Coverage) và dòng lệnh (Line Coverage).
- Xác minh tính vững chắc của hệ thống trước các tình huống bất thường: lỗi kết nối cơ sở dữ liệu, vi phạm ràng buộc toàn vẹn khóa ngoại, tham số query/params rỗng, dữ liệu đầu vào không hợp lệ, phân quyền và xác thực token JWT.

### 1.2 Phạm vi kiểm thử (Scope)
| Tên File / Thành phần | Đường dẫn | Chức năng chính |
| :--- | :--- | :--- |
| **`categoryController.js`** | `backend/src/controllers/categoryController.js` | Xử lý CRUD danh mục, tìm kiếm, đếm số lượng món trong danh mục |
| **`productController.js`** | `backend/src/controllers/productController.js` | Xử lý CRUD món ăn, tìm kiếm theo tên, lọc theo `category_id` |
| **`authMiddleware.js`** | `backend/src/middlewares/authMiddleware.js` | Middleware xác thực JWT & phân quyền Admin/Staff bảo vệ các API quản trị Category & Product |

---

## 2. TỔNG HỢP KẾT QUẢ CODE COVERAGE

| Chỉ số Coverage | Số lượng đạt được | Tổng số | Tỷ lệ (%) | Đánh giá |
| :--- | :---: | :---: | :---: | :---: |
| **Statements (Câu lệnh)** | **121** | **121** | **100%** | Xuất sắc |
| **Branches (Nhánh điều kiện)** | **37** | **37** | **100%** | Xuất sắc |
| **Functions (Hàm / Phương thức)** | **15** | **15** | **100%** | Xuất sắc |
| **Lines (Dòng lệnh)** | **118** | **118** | **100%** | Xuất sắc |

### 2.1 Bảng chi tiết độ bao phủ theo từng tệp (File Breakdown)

```text
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
```

---

## 3. THIẾT KẾ TESTCASE WHITE-BOX & PHÂN TÍCH NHÁNH (CONTROL FLOW ANALYSIS)

### 3.1 `categoryController.js` (14 Test Cases)

| ID | Hàm kiểm thử | Kịch bản / Nhánh thực thi (Branch/Path) | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected Output) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **WB-CAT-01** | `getAllCategories` | Query không có search, danh mục có kèm sản phẩm | `req.query = {}`, Category.findAll trả về list kèm `products` | HTTP 200, mảng danh mục có `productCount` đúng | **PASS** |
| **WB-CAT-02** | `getAllCategories` | Query không có search, danh mục không có sản phẩm (`products: null`) | `req.query = {}`, category có `products: null` | HTTP 200, `productCount = 0` | **PASS** |
| **WB-CAT-03** | `getAllCategories` | Query có search keyword (`search='sashimi'`) | `req.query = { search: 'sashimi' }` | Gọi findAll với Op.or (name, description), HTTP 200 | **PASS** |
| **WB-CAT-04** | `getAllCategories` | Ngoại lệ Database Error trong khối `try...catch` | `Category.findAll` ném lỗi Error | HTTP 500, trả về `{ message: error.message }` | **PASS** |
| **WB-CAT-05** | `getCategoryById` | Tìm danh mục tồn tại theo ID | `req.params.id = 1`, `Category.findByPk` tìm thấy | HTTP 200, trả về đối tượng Category | **PASS** |
| **WB-CAT-06** | `getCategoryById` | Tìm danh mục không tồn tại theo ID (`findByPk` trả về null) | `req.params.id = 999`, `findByPk = null` | HTTP 404, `{ message: "Not found" }` | **PASS** |
| **WB-CAT-07** | `getCategoryById` | Database Exception khi truy vấn theo ID | `Category.findByPk` ném Error | HTTP 500, `{ message: error.message }` | **PASS** |
| **WB-CAT-08** | `createCategory` | Tạo mới danh mục hợp lệ | `req.body = { name: 'Dessert', description: 'Sweet' }` | HTTP 201, trả về đối tượng vừa tạo | **PASS** |
| **WB-CAT-09** | `createCategory` | Lỗi Validation khi tạo (dữ liệu thiếu/lỗi) | `req.body = {}`, `Category.create` ném ValidationError | HTTP 400, `{ message: error.message }` | **PASS** |
| **WB-CAT-10** | `updateCategory` | Cập nhật danh mục thành công (`updated = 1`) | `req.params.id = 1`, `req.body = { name: 'Sushi' }` | HTTP 200, trả về đối tượng cập nhật | **PASS** |
| **WB-CAT-11** | `updateCategory` | Cập nhật danh mục không tồn tại (`updated = 0`) | `req.params.id = 999`, `Category.update` trả về `[0]` | HTTP 404, `{ message: "Not found" }` | **PASS** |
| **WB-CAT-12** | `updateCategory` | Lỗi Database/Validation khi cập nhật | `Category.update` ném Error | HTTP 400, `{ message: error.message }` | **PASS** |
| **WB-CAT-13** | `deleteCategory` | Xóa danh mục tồn tại (`deleted = 1`) | `req.params.id = 1`, `Category.destroy` trả về 1 | HTTP 204 No Content | **PASS** |
| **WB-CAT-14** | `deleteCategory` | Xóa danh mục không tồn tại (`deleted = 0`) | `req.params.id = 999`, `Category.destroy` trả về 0 | HTTP 404, `{ message: "Not found" }` | **PASS** |

---

### 3.2 `productController.js` (16 Test Cases)

| ID | Hàm kiểm thử | Kịch bản / Nhánh thực thi (Branch/Path) | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected Output) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **WB-PRD-01** | `getAllProducts` | Lấy tất cả món ăn, không truyền filter | `req.query = {}` | Gọi findAll với `where = {}`, HTTP 200 | **PASS** |
| **WB-PRD-02** | `getAllProducts` | Lọc món ăn theo danh mục `category_id` | `req.query = { category_id: '2' }` | Gọi findAll với `where = { category_id: '2' }`, HTTP 200 | **PASS** |
| **WB-PRD-03** | `getAllProducts` | Tìm kiếm món ăn theo từ khóa `search` | `req.query = { search: 'salmon' }` | Gọi findAll với `where = { name: { [Op.like]: '%salmon%' } }`, HTTP 200 | **PASS** |
| **WB-PRD-04** | `getAllProducts` | Kết hợp cả `category_id` và `search` | `req.query = { category_id: '1', search: 'maki' }` | Gọi findAll với cả 2 điều kiện, HTTP 200 | **PASS** |
| **WB-PRD-05** | `getAllProducts` | Database Exception khi truy vấn danh sách | `Product.findAll` ném Error | HTTP 500, `{ message: error.message }` | **PASS** |
| **WB-PRD-06** | `getProductById` | Tìm món ăn tồn tại theo ID | `req.params.id = 1`, `Product.findByPk` tìm thấy | HTTP 200, trả về đối tượng Product | **PASS** |
| **WB-PRD-07** | `getProductById` | Tìm món ăn không tồn tại theo ID | `req.params.id = 999`, `findByPk = null` | HTTP 404, `{ message: "Product not found" }` | **PASS** |
| **WB-PRD-08** | `getProductById` | Lỗi Database khi truy vấn món ăn theo ID | `Product.findByPk` ném Error | HTTP 500, `{ message: error.message }` | **PASS** |
| **WB-PRD-09** | `createProduct` | Thêm món ăn mới với dữ liệu hợp lệ | `req.body = { name: 'Eel Sushi', price: 65000, category_id: 1 }` | HTTP 201, trả về Product vừa tạo | **PASS** |
| **WB-PRD-10** | `createProduct` | Lỗi Validation khi thêm món ăn | `req.body = {}`, `Product.create` ném Error | HTTP 400, `{ message: error.message }` | **PASS** |
| **WB-PRD-11** | `updateProduct` | Cập nhật món ăn thành công (`updated = 1`) | `req.params.id = 1`, `req.body = { price: 55000 }` | HTTP 200, trả về đối tượng cập nhật | **PASS** |
| **WB-PRD-12** | `updateProduct` | Cập nhật món ăn không tồn tại (`updated = 0`) | `req.params.id = 999`, `Product.update = [0]` | HTTP 404, `{ message: "Product not found" }` | **PASS** |
| **WB-PRD-13** | `updateProduct` | Lỗi Validation/DB khi cập nhật | `Product.update` ném Error | HTTP 400, `{ message: error.message }` | **PASS** |
| **WB-PRD-14** | `deleteProduct` | Xóa món ăn thành công (`deleted = 1`) | `req.params.id = 1`, `Product.destroy = 1` | HTTP 204 No Content | **PASS** |
| **WB-PRD-15** | `deleteProduct` | Xóa món ăn không tồn tại (`deleted = 0`) | `req.params.id = 999`, `Product.destroy = 0` | HTTP 404, `{ message: "Product not found" }` | **PASS** |
| **WB-PRD-16** | `deleteProduct` | Lỗi Database khi xóa món ăn | `Product.destroy` ném Error | HTTP 500, `{ message: error.message }` | **PASS** |

---

### 3.3 `authMiddleware.js` (17 Test Cases)

| ID | Hàm kiểm thử | Kịch bản / Nhánh thực thi (Branch/Path) | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected Output) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **WB-AUTH-01** | `verifyToken` | Header Authorization bị thiếu | `req.headers = {}` | HTTP 401, `{ message: "No token" }` | **PASS** |
| **WB-AUTH-02** | `verifyToken` | Token hợp lệ với biến môi trường `JWT_SECRET` | `Authorization: 'Bearer valid_jwt'`, `process.env.JWT_SECRET = 'secret'` | Gán `req.user = decoded`, gọi `next()` | **PASS** |
| **WB-AUTH-03** | `verifyToken` | Token hợp lệ với secret mặc định ('secret_key') | `Authorization: 'Bearer valid_jwt'`, `JWT_SECRET` unset | Sử dụng fallback secret, gọi `next()` | **PASS** |
| **WB-AUTH-04** | `verifyToken` | Token không hợp lệ / hết hạn | `Authorization: 'Bearer invalid'`, `jwt.verify` ném Error | HTTP 401, `{ message: "Invalid token" }` | **PASS** |
| **WB-AUTH-05** | `optionalVerifyToken` | Không có header Authorization | `req.headers = {}` | Gán `req.user = null`, gọi `next()` | **PASS** |
| **WB-AUTH-06** | `optionalVerifyToken` | Token hợp lệ kèm biến `JWT_SECRET` | `Authorization: 'Bearer valid'`, `JWT_SECRET` defined | Gán `req.user = decoded`, gọi `next()` | **PASS** |
| **WB-AUTH-07** | `optionalVerifyToken` | Token hợp lệ với fallback secret | `Authorization: 'Bearer valid'`, `JWT_SECRET` unset | Gán `req.user = decoded`, gọi `next()` | **PASS** |
| **WB-AUTH-08** | `optionalVerifyToken` | Token lỗi trong optional auth | `Authorization: 'Bearer corrupted'`, `jwt.verify` ném Error | Không chặn mà gán `req.user = null`, gọi `next()` | **PASS** |
| **WB-AUTH-09** | `isAdmin` | Người dùng có role `ADMIN` (chữ hoa) | `req.user = { role: 'ADMIN' }` | Cho phép đi tiếp, gọi `next()` | **PASS** |
| **WB-AUTH-10** | `isAdmin` | Người dùng có role `admin` (chữ thường) | `req.user = { role: 'admin' }` | Cho phép đi tiếp, gọi `next()` | **PASS** |
| **WB-AUTH-11** | `isAdmin` | Người dùng có role `CUSTOMER` | `req.user = { role: 'CUSTOMER' }` | HTTP 403, `{ message: "Access denied. Admin only." }` | **PASS** |
| **WB-AUTH-12** | `isAdmin` | Người dùng không có trường `role` | `req.user = { id: 3 }` | HTTP 403, `{ message: "Access denied. Admin only." }` | **PASS** |
| **WB-AUTH-13** | `isAdmin` | Đối tượng `req.user` là null/undefined | `req.user = undefined` | HTTP 403, `{ message: "Access denied. Admin only." }` | **PASS** |
| **WB-AUTH-14** | `isStaffOrAdmin` | Người dùng có role `ADMIN` | `req.user = { role: 'ADMIN' }` | Cho phép đi tiếp, gọi `next()` | **PASS** |
| **WB-AUTH-15** | `isStaffOrAdmin` | Người dùng có role `STAFF` | `req.user = { role: 'staff' }` | Cho phép đi tiếp, gọi `next()` | **PASS** |
| **WB-AUTH-16** | `isStaffOrAdmin` | Người dùng là `CUSTOMER` | `req.user = { role: 'CUSTOMER' }` | HTTP 403, `{ message: "Access denied. Staff or Admin only." }` | **PASS** |
| **WB-AUTH-17** | `isStaffOrAdmin` | Đối tượng `req.user` bị undefined | `req.user = undefined` | HTTP 403, `{ message: "Access denied. Staff or Admin only." }` | **PASS** |

---

## 4. HƯỚNG DẪN TÁI HIỆN VÀ CHẠY TEST TỰ ĐỘNG

Chuyển vào thư mục backend và chạy lệnh:

```bash
cd backend

# Chạy toàn bộ test suites White-box
npm test

# Chạy test suite và xuất báo cáo Code Coverage chi tiết
npm run test:coverage
```

Báo cáo coverage chi tiết dưới dạng web HTML sẽ được tự động tạo tại: `backend/coverage/lcov-report/index.html`.

---

## 5. KẾT LUẬN VÀ BÀN GIAO CHO NHÓM

1. **Chất lượng mã nguồn:** Toàn bộ logic nghiệp vụ, điều kiện rẽ nhánh và luồng xử lý lỗi trong module Category & Product đã được kiểm thử chặt chẽ với **100% độ bao phủ (Coverage)** trên mọi tiêu chí (Statements, Branches, Functions, Lines).
2. **Đóng gói báo cáo:**
   - File Test Cases Excel: [`docs/testing/WhiteBox/Category_Product/WhiteBox_Category_Product_TestCases.xlsx`](file:///c:/Users/ADMIN/OneDrive%20-%20ut.edu.vn/Backup/Desktop/Clone%20CNPM/clone2/KCPM-2026/docs/testing/WhiteBox/Category_Product/WhiteBox_Category_Product_TestCases.xlsx).
   - Kết quả thực thi Markdown: [`docs/testing/WhiteBox/Category_Product/WhiteBox_Category_Product_Test_Execution_Result.md`](file:///c:/Users/ADMIN/OneDrive%20-%20ut.edu.vn/Backup/Desktop/Clone%20CNPM/clone2/KCPM-2026/docs/testing/WhiteBox/Category_Product/WhiteBox_Category_Product_Test_Execution_Result.md).
