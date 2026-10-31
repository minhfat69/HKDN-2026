# SCRUM-26 – Phân quyền API Testcase Log

## 1. Thông tin

- **Module:** Authentication / Authorization - Phân quyền theo Role
- **Endpoint chính:** `/api/users`, `/api/stats`, `/api/auth/login`, `/api/auth/register`, `/api/users/profile`
- **Collection:** `SCRUM-26 - Phân quyền API`
- **Số testcase:** 14
- **Công cụ:** Postman
- **Backend:** `http://localhost:3000`
- **Roles kiểm thử:** Admin, Staff, Customer, Kitchen

## 2. Danh sách testcase

| ID | Testcase | Method | Endpoint | Expected |
|---|---|---|---|---|
| PERM-AUTH-01 | Đăng nhập Admin | POST | `/api/auth/login` | HTTP 200, có token và role ADMIN |
| PERM-ADMIN-01 | Admin - Xem danh sách người dùng | GET | `/api/users` | HTTP 200, trả về array users |
| PERM-ADMIN-02 | Admin - Tạo nhân viên Staff | POST | `/api/users` | HTTP 201, `Tạo người dùng thành công` |
| PERM-AUTH-02 | Đăng nhập Staff | POST | `/api/auth/login` | HTTP 200, có token và role STAFF |
| PERM-STAFF-01 | Staff - Xem danh sách người dùng | GET | `/api/users` | HTTP 200, trả về array users |
| PERM-STAFF-02 | Staff - Truy cập thống kê (Bị từ chối) | GET | `/api/stats` | HTTP 403, `Access denied. Admin only.` |
| PERM-AUTH-03 | Đăng ký Customer | POST | `/api/auth/register` | HTTP 201, `Đăng ký thành công` |
| PERM-AUTH-04 | Đăng nhập Customer | POST | `/api/auth/login` | HTTP 200, có token và role CUSTOMER |
| PERM-CUSTOMER-01 | Customer - Xem danh sách user (Bị từ chối) | GET | `/api/users` | HTTP 403, `Access denied. Staff or Admin only.` |
| PERM-CUSTOMER-02 | Customer - Xem thông tin cá nhân | GET | `/api/users/profile` | HTTP 200, trả về profile |
| PERM-ADMIN-03 | Admin - Tạo nhân viên Kitchen | POST | `/api/users` | HTTP 201, `Tạo người dùng thành công` |
| PERM-AUTH-05 | Đăng nhập Kitchen | POST | `/api/auth/login` | HTTP 200, có token và role KITCHEN |
| PERM-KITCHEN-01 | Kitchen - Xem danh sách user (Bị từ chối) | GET | `/api/users` | HTTP 403, `Access denied. Staff or Admin only.` |
| PERM-KITCHEN-02 | Kitchen - Xem thống kê (Bị từ chối) | GET | `/api/stats` | HTTP 403, `Access denied. Admin only.` |

## 3. Ma trận phân quyền kiểm thử

| Endpoint | Admin | Staff | Customer | Kitchen |
|---|:---:|:---:|:---:|:---:|
| `GET /api/users` | ✓ 200 | ✓ 200 | ✗ 403 | ✗ 403 |
| `POST /api/users` | ✓ 201 | ✗ 403 | ✗ 403 | ✗ 403 |
| `GET /api/stats` | ✓ 200 | ✗ 403 | ✗ 403 | ✗ 403 |
| `GET /api/users/profile` | ✓ 200 | ✓ 200 | ✓ 200 | ✓ 200 |
| `POST /api/auth/login` | ✓ 200 | ✓ 200 | ✓ 200 | ✓ 200 |
| `POST /api/auth/register` | - | - | ✓ 201 | - |


## 4. Thứ tự thực thi bắt buộc

Khi chạy collection, thứ tự phải được tuân thủ:

```
1. PERM-AUTH-01 → Admin Login (tạo adminToken)
2. PERM-ADMIN-01 → Admin xem danh sách users
3. PERM-ADMIN-02 → Admin tạo Staff (sinh staffUsername, staffEmail, staffPhone)
4. PERM-AUTH-02 → Staff Login (tạo staffToken)
5. PERM-STAFF-01 → Staff xem danh sách users
6. PERM-STAFF-02 → Staff truy cập stats (bị 403)
7. PERM-AUTH-03 → Customer Register (sinh customerUsername, customerEmail, customerPhone)
8. PERM-AUTH-04 → Customer Login (tạo customerToken)
9. PERM-CUSTOMER-01 → Customer xem danh sách users (bị 403)
10. PERM-CUSTOMER-02 → Customer xem profile cá nhân
11. PERM-ADMIN-03 → Admin tạo Kitchen (sinh kitchenUsername, kitchenEmail, kitchenPhone)
12. PERM-AUTH-05 → Kitchen Login (tạo kitchenToken)
13. PERM-KITCHEN-01 → Kitchen xem danh sách users (bị 403)
14. PERM-KITCHEN-02 → Kitchen xem stats (bị 403)
```

> **Lưu ý quan trọng:** Mỗi test auth (PERM-AUTH-0x) phải chạy trước các test sử dụng token đó.



## 5. Kết quả kiểm thử

### Dự tính

- **Tổng assertions:** ~40+
- **Targets:** Tất cả pass (14/14 test)
- **Lỗi thường gặp:** 
  - Duplicate email/username/phone (fix: dùng timestamp)
  - Sai format header Authorization (fix: dùng `Bearer {{token}}`)
  - Token hết hạn (fix: chạy ngay sau login)

## 6. Trạng thái

- [x] Tạo 14 test case phân quyền
- [x] Cấu hình token tự động
- [x] Sinh dữ liệu unique (timestamp)
- [x] Test Admin có quyền quản trị
- [x] Test Staff có quyền xem user nhưng không stats
- [x] Test Customer có quyền profile nhưng không danh sách user
- [x] Test Kitchen bị từ chối stats và danh sách user
- [x] Cấu hình thứ tự thực thi
- [ ] Chạy collection và verify kết quả
