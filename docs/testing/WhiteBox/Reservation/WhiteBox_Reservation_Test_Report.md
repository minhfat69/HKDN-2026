# BÁO CÁO KIỂM THỬ HỘP TRẮNG (WHITE-BOX TESTING) & ĐỘ BAO PHỦ MÃ NGUỒN (CODE COVERAGE)

**Học phần:** Kiểm chứng và Đảm bảo Chất lượng Phần mềm (KCPM)  
**Dự án:** FutureSushi - Hệ thống Đặt món & Quản lý Nhà hàng Sushi  
**Module phụ trách:** Quản lý Đặt bàn (Reservation Management)  
**Người thực hiện:** ........................................  
**Công cụ kiểm thử:** Jest Framework, Istanbul Code Coverage Reporter  
**Ngày thực hiện:** 23/08/2026  

---

## 1. TỔNG QUAN VÀ MỤC TIÊU KIỂM THỬ

### 1.1 Mục tiêu

- Kiểm thử cấu trúc nội bộ mã nguồn (White-Box Testing / Structural Testing) cho các hàm điều khiển thuộc module **Reservation Management**.
- Đảm bảo kiểm tra các câu lệnh, nhánh rẽ điều kiện, hàm/phương thức và dòng lệnh trong `reservationController.js`.
- Kiểm tra các luồng xử lý thành công và các trường hợp lỗi.
- Xác minh tính đúng đắn của hệ thống trong các tình huống như không tìm thấy reservation, trạng thái reservation không hợp lệ, check-in sai thời gian, không có bàn phù hợp và lỗi cơ sở dữ liệu.
- Kiểm tra cơ chế transaction, bao gồm `commit`, `rollback` và xử lý ngoại lệ thông qua `next(error)`.

### 1.2 Phạm vi kiểm thử (Scope)

| Tên File / Thành phần | Đường dẫn | Chức năng chính |
| :--- | :--- | :--- |
| **`reservationController.js`** | `backend/controllers/reservationController.js` | Xử lý tạo reservation, xác nhận, check-in, hủy, cập nhật trạng thái và lấy danh sách reservation |

---

## 2. TỔNG HỢP KẾT QUẢ CODE COVERAGE

| Chỉ số Coverage | Tỷ lệ (%) | Đánh giá |
| :--- | :---: | :--- |
| **Statements (Câu lệnh)** | **100%** | Xuất sắc |
| **Branches (Nhánh điều kiện)** | **88.23%** | Rất tốt |
| **Functions (Hàm / Phương thức)** | **100%** | Xuất sắc |
| **Lines (Dòng lệnh)** | **100%** | Xuất sắc |

### 2.1 Bảng chi tiết độ bao phủ theo từng tệp (File Breakdown)

```text
--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |     100 |    88.23 |     100 |     100 |
reservationController.js  |     100 |    88.23 |     100 |     100 |
--------------------------|---------|----------|---------|---------|
```

Kết quả kiểm thử cho thấy file `reservationController.js` đạt:

- **Statements Coverage: 100%**
- **Branch Coverage: 88.23%**
- **Function Coverage: 100%**
- **Line Coverage: 100%**

---

## 3. THIẾT KẾ TESTCASE WHITE-BOX & PHÂN TÍCH NHÁNH (CONTROL FLOW ANALYSIS)

### 3.1 `reservationController.js` (26 Test Cases)

| ID | Hàm kiểm thử | Kịch bản / Nhánh thực thi (Branch/Path) | Dữ liệu đầu vào (Input) | Kết quả mong đợi (Expected Output) | Trạng thái |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **WB-RES-01** | `createReservation` | Có bàn phù hợp và còn trống trong thời gian đặt | Reservation hợp lệ, có bàn phù hợp | Tạo reservation thành công | **PASS** |
| **WB-RES-02** | `createReservation` | Không tìm được bàn phù hợp với số lượng khách | `numberOfGuests` lớn hơn sức chứa bàn khả dụng | Trả HTTP 400 | **PASS** |
| **WB-RES-03** | `createReservation` | Bàn đã có reservation trong khung giờ yêu cầu | Thời gian đặt bị trùng với reservation khác | Không chọn bàn bị chiếm | **PASS** |
| **WB-RES-04** | `createReservation` | Database Error trong quá trình tạo reservation | Model/database ném Error | Rollback transaction, trả HTTP 500 | **PASS** |
| **WB-RES-05** | `checkIn` | Không tìm thấy reservation theo ID | `req.params.id` không tồn tại | HTTP 404 | **PASS** |
| **WB-RES-06** | `checkIn` | Reservation có trạng thái không được phép check-in | Status không hợp lệ | HTTP 400 | **PASS** |
| **WB-RES-07** | `checkIn` | Check-in sớm hơn giới hạn 30 phút | Current time < Reservation time - 30 phút | HTTP 400 | **PASS** |
| **WB-RES-08** | `checkIn` | Check-in muộn hơn giới hạn 30 phút | Current time > Reservation time + 30 phút | HTTP 400 | **PASS** |
| **WB-RES-09** | `checkIn` | Check-in trong khoảng thời gian hợp lệ | Thời gian hợp lệ trong khoảng ±30 phút | Check-in thành công | **PASS** |
| **WB-RES-10** | `checkIn` | Lỗi hệ thống trong quá trình check-in | Database/transaction ném Error | Rollback và gọi `next(error)` | **PASS** |
| **WB-RES-11** | `cancelReservation` | Không tìm thấy reservation cần hủy | ID không tồn tại | HTTP 404 | **PASS** |
| **WB-RES-12** | `cancelReservation` | Reservation ở trạng thái `PENDING` | `status = PENDING` | Hủy reservation thành công | **PASS** |
| **WB-RES-13** | `cancelReservation` | Reservation ở trạng thái `CONFIRMED` | `status = CONFIRMED` | Hủy reservation thành công | **PASS** |
| **WB-RES-14** | `cancelReservation` | Reservation ở trạng thái không được phép hủy | Ví dụ `CHECKED_IN` | HTTP 400 | **PASS** |
| **WB-RES-15** | `cancelReservation` | Lỗi hệ thống khi hủy reservation | Model/database ném Error | Gọi `next(error)` | **PASS** |
| **WB-RES-16** | `confirmReservation` | Không tìm thấy reservation cần xác nhận | ID không tồn tại | HTTP 404 | **PASS** |
| **WB-RES-17** | `confirmReservation` | Reservation ở trạng thái `PENDING` | `status = PENDING` | Chuyển sang `CONFIRMED` thành công | **PASS** |
| **WB-RES-18** | `confirmReservation` | Reservation không ở trạng thái `PENDING` | Status khác `PENDING` | HTTP 400 | **PASS** |
| **WB-RES-19** | `confirmReservation` | Lỗi hệ thống khi xác nhận | Model/database ném Error | Gọi `next(error)` | **PASS** |
| **WB-RES-20** | `updateReservationStatus` | Cập nhật trạng thái reservation thành công | ID hợp lệ, status hợp lệ | HTTP 200, cập nhật thành công | **PASS** |
| **WB-RES-21** | `updateReservationStatus` | Không tìm thấy reservation cần cập nhật | ID không tồn tại | HTTP 404 | **PASS** |
| **WB-RES-22** | `updateReservationStatus` | Lỗi database khi cập nhật | Model/database ném Error | Gọi `next(error)` | **PASS** |
| **WB-RES-23** | `getMyReservations` | Lấy danh sách reservation của user thành công | `req.user` hợp lệ | HTTP 200, trả danh sách reservation | **PASS** |
| **WB-RES-24** | `getMyReservations` | Database Error khi lấy reservation của user | `Reservation.findAll` ném Error | Gọi `next(error)` | **PASS** |
| **WB-RES-25** | `getAllReservations` | Lấy toàn bộ danh sách reservation thành công | Database trả về danh sách | HTTP 200 | **PASS** |
| **WB-RES-26** | `getAllReservations` | Database Error khi lấy toàn bộ reservation | `Reservation.findAll` ném Error | Gọi `next(error)` | **PASS** |

---

## 4. KẾT QUẢ THỰC THI KIỂM THỬ

Kết quả chạy White-Box Test:

```text
Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
```

### 4.1 Tổng hợp kết quả

| Test Suite | Total Tests | Passed | Failed | Result |
| :--- | :---: | :---: | :---: | :---: |
| Reservation Controller | 26 | 26 | 0 | **PASS** |

**Kết quả: 26/26 Test Case PASSED.**

---

## 5. HƯỚNG DẪN TÁI HIỆN VÀ CHẠY TEST TỰ ĐỘNG

Chuyển vào thư mục backend và chạy lệnh:

```bash
cd backend
```

### Chạy riêng White-Box Test Reservation

```bash
npx jest whitebox-tests/reservationController.test.js
```

### Chạy White-Box Test Reservation kèm Code Coverage

```bash
npx jest whitebox-tests/reservationController.test.js --coverage
```

Hoặc sử dụng script trong `package.json`:

```bash
npm run test:reservation:coverage
```

Báo cáo coverage chi tiết dưới dạng web HTML được tạo tại:

```text
backend/coverage/lcov-report/index.html
```

---

## 6. TÀI NGUYÊN KIỂM THỬ

Các file bàn giao của module Reservation:

```text
backend/
│
├── controllers/
│   └── reservationController.js
│
├── whitebox-tests/
│   └── reservationController.test.js
│
└── coverage/
    └── lcov-report/
        └── index.html


docs/
└── testing/
    └── WhiteBox/
        └── Reservation/
            ├── WhiteBox_Reservation_TestCases.xlsx
            ├── WhiteBox_Reservation_Test_Execution_Result.md
            └── WhiteBox_Reservation_Test_Report.md
```

---

## 7. KẾT LUẬN VÀ BÀN GIAO CHO NHÓM

1. **Chất lượng mã nguồn:** Module `Reservation Management` đã được kiểm thử bằng phương pháp White-Box Testing trên các luồng xử lý chính, các điều kiện rẽ nhánh, trạng thái reservation, giới hạn thời gian check-in và các trường hợp lỗi hệ thống.

2. **Kết quả kiểm thử:** Toàn bộ **26/26 Test Case đều PASS**, không có test case thất bại.

3. **Code Coverage:**
   - Statements: **100%**
   - Branches: **88.23%**
   - Functions: **100%**
   - Lines: **100%**

4. **Đóng gói báo cáo:**
   - File Test Cases Excel: `docs/testing/WhiteBox/Reservation/WhiteBox_Reservation_TestCases.xlsx`
   - Kết quả thực thi Markdown: `docs/testing/WhiteBox/Reservation/WhiteBox_Reservation_Test_Execution_Result.md`
   - Báo cáo White-Box: `docs/testing/WhiteBox/Reservation/WhiteBox_Reservation_Test_Report.md`
   - File mã nguồn Test: `backend/whitebox-tests/reservationController.test.js`

---

# KẾT QUẢ CUỐI CÙNG: PASS

**Test Suites:** 1/1 PASSED  
**Test Cases:** 26/26 PASSED  
**Statements Coverage:** 100%  
**Branch Coverage:** 88.23%  
**Function Coverage:** 100%  
**Line Coverage:** 100%