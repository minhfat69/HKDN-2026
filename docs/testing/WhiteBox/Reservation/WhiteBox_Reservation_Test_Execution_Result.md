# KẾT QUẢ THỰC THI KIỂM THỬ HỘP TRẮNG & CODE COVERAGE (TEST EXECUTION RESULT)

**Dự án:** FutureSushi - Hệ thống Đặt món & Quản lý Nhà hàng Sushi

**Module kiểm thử:** Reservation Management

**Thư mục chứa Test Suite:** `backend/whitebox-tests/`

**Môi trường kiểm thử:** Node.js, Jest Test Runner, Istanbul Coverage

**Loại kiểm thử:** White-Box Testing

**Đối tượng kiểm thử:** `backend/controllers/reservationController.js`

---

## 1. TỔNG KẾT KẾT QUẢ THỰC THI (EXECUTIVE TEST SUMMARY)

| Chỉ số tổng quan | Giá trị thực tế | Tỷ lệ đạt được | Đánh giá |
| :--- | :---: | :---: | :--- |
| **Tổng số Test Suites** | 1 / 1 Suite | **100% PASS** | Đạt yêu cầu |
| **Tổng số Test Cases** | **26 / 26 Cases** | **100% PASS** | Hoàn thành |
| **Số Test Case thất bại (Failed)** | 0 Cases | **0%** | Không có lỗi |
| **Statements Coverage** | 100% | **100%** | Xuất sắc |
| **Branches Coverage** | 88.23% | **88.23%** | Đạt |
| **Functions Coverage** | 100% | **100%** | Xuất sắc |
| **Lines Coverage** | 100% | **100%** | Xuất sắc |

---

## 2. KẾT QUẢ CHI TIẾT THEO TEST SUITE

### 2.1 Test Suite: `reservationController.test.js` (26/26 PASS)

- **File kiểm thử:** `backend/whitebox-tests/reservationController.test.js`
- **Đối tượng kiểm thử:** `backend/controllers/reservationController.js`
- **Kết quả Coverage:** Statements: 100% | Branches: 88.23% | Functions: 100% | Lines: 100%

| Test Case ID | Tên Kịch Bản Kiểm Thử | Assertion / Kỳ vọng kiểm tra | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :--- | :---: |
| **WB-RES-01** | `createReservation` tạo đặt bàn thành công | Tìm được bàn phù hợp, tạo reservation và trả HTTP 201 | Reservation được tạo thành công | **PASS** |
| **WB-RES-02** | `createReservation` không có bàn phù hợp | Không tìm được bàn phù hợp, rollback và trả HTTP 400 | HTTP 400, thông báo không còn bàn phù hợp | **PASS** |
| **WB-RES-03** | `createReservation` có bàn bị chiếm trong khung giờ | Bàn đã có reservation chồng thời gian không được chọn | Bàn bị chiếm được loại khỏi danh sách bàn khả dụng | **PASS** |
| **WB-RES-04** | `createReservation` lỗi database | `Reservation.findAll` phát sinh lỗi | Rollback transaction và trả HTTP 500 | **PASS** |
| **WB-RES-05** | `checkIn` không tìm thấy reservation | `findByPk` trả về `null` | Rollback và trả HTTP 404 | **PASS** |
| **WB-RES-06** | `checkIn` trạng thái không hợp lệ | Status không phải `PENDING` hoặc `CONFIRMED` | Rollback và trả HTTP 400 | **PASS** |
| **WB-RES-07** | `checkIn` quá sớm | Thời điểm hiện tại sớm hơn 30 phút trước giờ đặt | Rollback và trả HTTP 400 | **PASS** |
| **WB-RES-08** | `checkIn` quá muộn | Thời điểm hiện tại muộn hơn 30 phút sau giờ đặt | Rollback và trả HTTP 400 | **PASS** |
| **WB-RES-09** | `checkIn` đúng thời gian | Check-in trong khoảng thời gian cho phép | Reservation chuyển `CHECKED_IN`, bàn chuyển `OCCUPIED` | **PASS** |
| **WB-RES-10** | `checkIn` xảy ra lỗi hệ thống | Lỗi trong quá trình cập nhật dữ liệu | Rollback và gọi `next(error)` | **PASS** |
| **WB-RES-11** | `cancelReservation` không tìm thấy reservation | `findByPk` trả về `null` | HTTP 404 Not Found | **PASS** |
| **WB-RES-12** | `cancelReservation` hủy trạng thái `PENDING` | Reservation đang ở trạng thái `PENDING` | Chuyển trạng thái thành `CANCELLED` | **PASS** |
| **WB-RES-13** | `cancelReservation` hủy trạng thái `CONFIRMED` | Reservation đang ở trạng thái `CONFIRMED` | Chuyển trạng thái thành `CANCELLED` | **PASS** |
| **WB-RES-14** | `cancelReservation` trạng thái không thể hủy | Status không phải `PENDING` hoặc `CONFIRMED` | HTTP 400 Bad Request | **PASS** |
| **WB-RES-15** | `cancelReservation` lỗi hệ thống | Lỗi khi lưu reservation | Gọi `next(error)` | **PASS** |
| **WB-RES-16** | `confirmReservation` không tìm thấy reservation | `findByPk` trả về `null` | HTTP 404 Not Found | **PASS** |
| **WB-RES-17** | `confirmReservation` xác nhận thành công | Reservation có trạng thái `PENDING` | Chuyển trạng thái thành `CONFIRMED` | **PASS** |
| **WB-RES-18** | `confirmReservation` trạng thái không hợp lệ | Reservation không có trạng thái `PENDING` | HTTP 400 Bad Request | **PASS** |
| **WB-RES-19** | `confirmReservation` lỗi hệ thống | Lỗi khi lưu trạng thái mới | Gọi `next(error)` | **PASS** |
| **WB-RES-20** | `updateReservationStatus` thành công | Reservation tồn tại và có trạng thái mới | Cập nhật trạng thái thành công | **PASS** |
| **WB-RES-21** | `updateReservationStatus` không tìm thấy reservation | `findByPk` trả về `null` | HTTP 404 Not Found | **PASS** |
| **WB-RES-22** | `updateReservationStatus` lỗi hệ thống | Lỗi trong quá trình cập nhật | Gọi `next(error)` | **PASS** |
| **WB-RES-23** | `getMyReservations` thành công | User đã xác thực và có thể truy vấn dữ liệu | Trả về danh sách reservation của user | **PASS** |
| **WB-RES-24** | `getMyReservations` lỗi database | `Reservation.findAll` phát sinh lỗi | Gọi `next(error)` | **PASS** |
| **WB-RES-25** | `getAllReservations` thành công | Truy vấn danh sách toàn bộ reservation | Trả về danh sách reservation | **PASS** |
| **WB-RES-26** | `getAllReservations` lỗi database | `Reservation.findAll` phát sinh lỗi | Gọi `next(error)` | **PASS** |

---

## 3. LOG MÁY THỰC THI (RAW TEST EXECUTION LOG)

```text
> backend-app-dat-mon@1.0.0 test:reservation:coverage
> jest whitebox-tests/reservationController.test.js --coverage

PASS  whitebox-tests/reservationController.test.js

White-Box Testing: Reservation Controller

createReservation
  ✓ [WB-RES-01] Tạo đặt bàn thành công khi có bàn phù hợp
  ✓ [WB-RES-02] Không có bàn phù hợp -> trả về 400
  ✓ [WB-RES-03] Có bàn đã bị chiếm trong khung giờ đặt
  ✓ [WB-RES-04] Lỗi database khi tìm reservation -> rollback và trả 500

checkIn
  ✓ [WB-RES-05] Không tìm thấy reservation -> 404
  ✓ [WB-RES-06] Trạng thái không hợp lệ để check-in -> 400
  ✓ [WB-RES-07] Check-in quá sớm hơn 30 phút -> 400
  ✓ [WB-RES-08] Check-in quá muộn hơn 30 phút -> 400
  ✓ [WB-RES-09] Check-in đúng thời gian -> thành công
  ✓ [WB-RES-10] Lỗi khi check-in -> rollback và gọi next(error)

cancelReservation
  ✓ [WB-RES-11] Không tìm thấy reservation -> 404
  ✓ [WB-RES-12] Hủy reservation trạng thái PENDING thành công
  ✓ [WB-RES-13] Hủy reservation trạng thái CONFIRMED thành công
  ✓ [WB-RES-14] Không thể hủy reservation có trạng thái khác -> 400
  ✓ [WB-RES-15] Lỗi khi hủy reservation -> gọi next(error)

confirmReservation
  ✓ [WB-RES-16] Không tìm thấy reservation -> 404
  ✓ [WB-RES-17] Xác nhận reservation PENDING thành CONFIRMED
  ✓ [WB-RES-18] Reservation không phải PENDING -> 400
  ✓ [WB-RES-19] Lỗi khi xác nhận reservation -> next(error)

updateReservationStatus
  ✓ [WB-RES-20] Cập nhật trạng thái thành công
  ✓ [WB-RES-21] Không tìm thấy reservation -> 404
  ✓ [WB-RES-22] Lỗi khi cập nhật -> next(error)

getMyReservations
  ✓ [WB-RES-23] Lấy danh sách reservation của user thành công
  ✓ [WB-RES-24] Lỗi database -> next(error)

getAllReservations
  ✓ [WB-RES-25] Lấy toàn bộ reservation thành công
  ✓ [WB-RES-26] Lỗi database khi lấy toàn bộ reservation -> next(error)

--------------------------|---------|----------|---------|---------|
File                      | % Stmts | % Branch | % Funcs | % Lines |
--------------------------|---------|----------|---------|---------|
All files                 |     100 |    88.23 |     100 |     100 |
reservationController.js  |     100 |    88.23 |     100 |     100 |
--------------------------|---------|----------|---------|---------|

Test Suites: 1 passed, 1 total
Tests:       26 passed, 26 total
Snapshots:   0 total
```

---

## 4. TÀI NGUYÊN BÀN GIAO KÈM THEO

- **File mã nguồn Test:** `backend/whitebox-tests/reservationController.test.js`
- **File Test Case Excel:** `docs/testing/WhiteBox/Reservation/WhiteBox_Reservation_TestCases.xlsx`
- **File kết quả thực thi:** `docs/testing/WhiteBox/Reservation/WhiteBox_Reservation_Test_Execution_Result.md`
- **Báo cáo kiểm thử:** `docs/testing/WhiteBox/Reservation/WhiteBox_Reservation_Test_Report.md`
- **Báo cáo Coverage tự sinh:** `backend/coverage/lcov-report/index.html`

---

## 5. KẾT LUẬN

Module **Reservation Management** đã được thực hiện kiểm thử hộp trắng thông qua **26 test case**, bao phủ các chức năng chính:

- Tạo đặt bàn (`createReservation`)
- Nhận bàn (`checkIn`)
- Hủy đặt bàn (`cancelReservation`)
- Xác nhận đặt bàn (`confirmReservation`)
- Cập nhật trạng thái (`updateReservationStatus`)
- Lấy danh sách đặt bàn của người dùng (`getMyReservations`)
- Lấy toàn bộ danh sách đặt bàn (`getAllReservations`)

### Kết quả thực thi

- **Test Suites:** 1 / 1 PASS
- **Test Cases:** 26 / 26 PASS
- **Failed:** 0
- **Statements Coverage:** 100%
- **Branches Coverage:** 88.23%
- **Functions Coverage:** 100%
- **Lines Coverage:** 100%

# KẾT QUẢ CUỐI CÙNG: PASS