# BỘ KIỂM THỬ PHÂN TÍCH GIÁ TRỊ BIÊN (BOUNDARY VALUE ANALYSIS - BVA)
## MODULE: XÁC THỰC & NGƯỜI DÙNG (AUTHENTICATION & USER API)

---

## 1. GIỚI THIỆU
Thư mục này chứa toàn bộ thiết kế, ma trận kiểm thử và bộ công cụ thực thi kiểm thử giá trị biên (**Boundary Value Analysis - BVA**) cho các trường dữ liệu đầu vào (Inputs) của module **Authentication** (`/api/auth`) và **User Management** (`/api/users`) trên hệ thống **FutureSushi Backend**.

---

## 2. CẤU TRÚC THƯ MỤC KIỂM THỬ BVA

```
docs/testing/BVA/
├── Auth_User_BVA_Test_Matrix.md          # Đặc tả chi tiết ma trận test case BVA (68 Test Cases)
├── Auth_User_BVA_Postman_Collection.json # File Postman Collection v2.1 sẵn sàng import & chạy tự động
├── FutureSushi - Auth & User BVA Test Suite.postman_test_run.json # File kết quả chạy tự động (67 Test Cases)
├── Auth_User_BVA_TestCases.xlsx          # Bảng đặc tả chi tiết 67 BVA Test Cases định dạng Excel
├── Auth_User_BVA_TestCases_Result.xlsx   # Báo cáo kết quả thực thi & Phân tích Defect định dạng Excel
├── generate_bva_collection.js           # Script NodeJS sinh động Postman Collection
└── README.md                            # Tài liệu hướng dẫn sử dụng & báo cáo tổng quan
```

---

## 3. TỔNG HỢP MA TRẬN GIÁ TRỊ BIÊN (INPUT BOUNDARIES SUMMARY)

| Thuộc tính (Field) | Ràng buộc DB / Schema | Min - 1 (Invalid) | Min (Valid) | Min + 1 (Valid) | Max - 1 (Valid) | Max (Valid) | Max + 1 (Invalid) |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **`fullName`** | `VARCHAR(100)`, NOT NULL | 0 ký tự (`""`) | 1 ký tự | 2 ký tự | 99 ký tự | 100 ký tự | 101 ký tự |
| **`username`** | `VARCHAR(40)`, NOT NULL, UNIQUE | 2 ký tự | 3 ký tự | 4 ký tự | 39 ký tự | 40 ký tự | 41 ký tự |
| **`password`** | `VARCHAR(255)`, NOT NULL | 5 ký tự | 6 ký tự | 7 ký tự | 254 ký tự | 255 ký tự | 256 ký tự |
| **`phone`** | `VARCHAR(20)`, NOT NULL, UNIQUE | 9 ký tự | 10 ký tự | 11 ký tự | 19 ký tự | 20 ký tự | 21 ký tự |
| **`email`** | `VARCHAR(100)`, UNIQUE, Nullable | 4 ký tự | 5 ký tự (`a@b.c`) | 6 ký tự | 99 ký tự | 100 ký tự | 101 ký tự |
| **`points`** | `INTEGER` (32-bit), >= 0 | `-1` | `0` | `1` | `2,147,483,646` | `2,147,483,647` | `2,147,483,648` |
| **`id` (Param)** | `BIGINT`, Primary Key | `0`, `-1` | `1` | `2` | `9007199254740990` | `9007199254740991` | `9007199254740992` |
| **`role`** | `ENUM` | Ngoại biên: `"SUPER_ADMIN"`, `"GUEST"` | Biên hợp lệ: `"CUSTOMER"`, `"STAFF"`, `"KITCHEN"`, `"ADMIN"` | | | | |
| **`status`** | `ENUM` | Ngoại biên: `"INACTIVE"`, `"DELETED"` | Biên hợp lệ: `"ACTIVE"`, `"BLOCKED"` | | | | |

---

## 4. HƯỚNG DẪN THỰC THI TRÊN POSTMAN

### Cách 1: Chạy bằng Postman Desktop App (GUI)
1. Mở ứng dụng **Postman**.
2. Bấm nút **Import** (góc trên bên trái).
3. Chọn file [`Auth_User_BVA_Postman_Collection.json`](./Auth_User_BVA_Postman_Collection.json).
4. Kiểm tra biến môi trường `baseUrl` (Mặc định: `http://localhost:3000`).
5. Chọn Collection **FutureSushi - Auth & User BVA Test Suite** -> Bấm **Run Collection**.
6. Chọn tất cả các nhóm test case và bấm **Run FutureSushi - Auth & User BVA Test Suite**.

### Cách 2: Chạy tự động qua CLI bằng Newman
```bash
# Cài đặt Newman (nếu chưa có)
npm install -g newman

# Thực thi toàn bộ bộ test BVA và xuất kết quả ra màn hình
newman run "docs/testing/BVA/Auth_User_BVA_Postman_Collection.json"
```

---

## 5. THỐNG KÊ ĐỘ BAO PHỦ KIỂM THỬ (TEST COVERAGE)

- **Tổng số ca kiểm thử biên (BVA Test Cases):** 68 ca
- **Các nhóm chức năng bao phủ:**
  - `POST /api/auth/register`: 28 ca (fullName, username, password, phone, email)
  - `POST /api/auth/login`: 8 ca (account, password, empty boundaries)
  - `PUT /api/users/:id`: 15 ca (ID boundaries, points integer boundaries, enum role, enum status, self-blocking)
  - `PUT /api/users/profile`: 6 ca (avatar TEXT, fullName, phone)
  - `GET /api/users`: 6 ca (search query string length, filter role/status)
  - `DELETE /api/users/:id`: 5 ca (ID boundaries, self-deletion defense)
- **Tỷ lệ bao phủ các biên đặc tả (Coverage):** **100% các trường dữ liệu đầu vào.**
