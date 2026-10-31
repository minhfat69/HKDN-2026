# BỘ KIỂM THỬ HỘP TRẮNG & BÁO CÁO ĐỘ BAO PHỦ MÃ NGUỒN (WHITE-BOX TESTING & CODE COVERAGE)
## MODULE: XÁC THỰC & QUẢN LÝ NGƯỜI DÙNG (`/api/auth` & `/api/users`)

---

## 1. GIỚI THIỆU
Thư mục này chứa toàn bộ tài liệu đặc tả, bộ testcase tự động hóa bằng **Jest & Mock** và file báo cáo Excel xuất chi tiết cho kỹ thuật kiểm thử hộp trắng (**White-box Testing / Structural Testing**) trên hệ thống **FutureSushi Backend**.

---

## 2. DANH MỤC FILE
- [`Auth_User_Whitebox_TestCases_Coverage.xlsx`](./Auth_User_Whitebox_TestCases_Coverage.xlsx): Bảng đặc tả chi tiết 42 Test Cases White-Box và Bảng tổng hợp chỉ số Code Coverage (Statements, Branches, Functions, Lines) định dạng Excel chuyên nghiệp 2 sheets.
- [`backend/tests/whitebox/authController.whitebox.test.js`](file:///c:/Users/fptsh/OneDrive/Máy tính/KCPM/KCPM-2026/backend/tests/whitebox/authController.whitebox.test.js): Test suite White-box cho `authController.js` (100% Coverage).
- [`backend/tests/whitebox/userController.whitebox.test.js`](file:///c:/Users/fptsh/OneDrive/Máy tính/KCPM/KCPM-2026/backend/tests/whitebox/userController.whitebox.test.js): Test suite White-box cho `userController.js` (100% Coverage).

---

## 3. TỔNG HỢP CHỈ SỐ CODE COVERAGE

| File / Module | Statements | Branches | Functions | Lines | Đánh giá |
| :--- | :---: | :---: | :---: | :---: | :---: |
| `backend/src/controllers/authController.js` | **100.00%** (31/31) | **100.00%** (14/14) | **100.00%** (2/2) | **100.00%** (31/31) | ✅ Xuất sắc |
| `backend/src/controllers/userController.js` | **100.00%** (94/94) | **100.00%** (69/69) | **100.00%** (7/7) | **100.00%** (91/91) | ✅ Xuất sắc |
| `backend/src/routes/authRoutes.js` | **100.00%** (10/10) | **100.00%** (2/2) | **100.00%** (1/1) | **100.00%** (10/10) | ✅ Xuất sắc |
| `backend/src/routes/userRoutes.js` | **100.00%** (28/28) | **100.00%** (2/2) | **100.00%** (1/1) | **100.00%** (28/28) | ✅ Xuất sắc |

---

## 4. HƯỚNG DẪN THỰC THI

```bash
cd backend

# Chạy kiểm thử White-box
npm run test:whitebox

# Chạy và xem báo cáo độ bao phủ chi tiết
npm run test:coverage
```
