# BÁO CÁO KIỂM THỬ HỘP TRẮNG (WHITE-BOX TESTING)
# & ĐỘ BAO PHỦ MÃ NGUỒN (CODE COVERAGE) – TABLE MODULE

**Học phần:** Kiểm chứng và Đảm bảo Chất lượng Phần mềm (KCPM)  
**Dự án:** FutureSuShi – Hệ thống Đặt món & Quản lý Nhà hàng Sushi  
**Module:** Table Management  
**Đối tượng kiểm thử:** `backend/src/controllers/tableController.js`  
**Công cụ:** Jest + Istanbul Code Coverage  
**Phương pháp:** White-Box / Structural Testing  

---

## 1. MỤC TIÊU KIỂM THỬ

Mục tiêu của kiểm thử WhiteBox đối với module Table là kiểm tra các luồng xử lý bên trong `tableController.js`, thay vì chỉ kiểm tra đầu vào và đầu ra của API.

Bộ kiểm thử tập trung vào:

1. Luồng xử lý thành công của từng chức năng.
2. Nhánh dữ liệu không tồn tại.
3. Nhánh kiểm tra dữ liệu trùng.
4. Các giá trị mặc định khi dữ liệu đầu vào rỗng hoặc bằng 0.
5. Các điều kiện liên quan đến đơn hàng chưa thanh toán.
6. Các điều kiện liên quan đến đơn hàng chưa hoàn tất.
7. Fallback khi truy vấn bản ghi theo cách đầu tiên không trả về dữ liệu.
8. Xử lý QR Code tồn tại/không tồn tại.
9. Kiểm tra body của Bulk Create.
10. Nhánh exception/database error.
11. Các nhánh xử lý thời gian của active order.
12. Các nhánh reservation `CHECKED_IN`.

---

## 2. PHẠM VI KIỂM THỬ

Module Table gồm các hàm chính:

| STT | Hàm | Nội dung |
|---:|---|---|
| 1 | `createTable` | Tạo bàn mới, kiểm tra trùng và giá trị mặc định |
| 2 | `updateTable` | Cập nhật thông tin bàn và các điều kiện liên quan order |
| 3 | `updateTableStatus` | Cập nhật trạng thái bàn |
| 4 | `deleteTable` | Xóa bàn và kiểm tra order chưa hoàn tất |
| 5 | `getTableByQRCode` | Tìm bàn theo QR Code |
| 6 | `getAllTables` | Lấy danh sách bàn và thông tin order/reservation |
| 7 | `bulkCreateTables` | Tạo nhiều bàn cùng lúc |

---

## 3. THIẾT KẾ WHITE-BOX TEST

Bộ test được thiết kế để đi qua các loại path chính trong controller:

### 3.1 Success Path

Kiểm tra khi dữ liệu hợp lệ và điều kiện nghiệp vụ cho phép xử lý.

Ví dụ:

```text
Request hợp lệ
      ↓
Tìm thấy dữ liệu
      ↓
Điều kiện nghiệp vụ hợp lệ
      ↓
Thực hiện create/update/delete
      ↓
Response thành công
```

Các testcase tiêu biểu:

- WB-TB-001
- WB-TB-009
- WB-TB-016
- WB-TB-021
- WB-TB-024
- WB-TB-026

---

### 3.2 Not-Found Path

Kiểm tra khi ID hoặc QR Code không tồn tại.

```text
Request
   ↓
Tìm dữ liệu
   ↓
Không tìm thấy
   ↓
HTTP 404
```

Các testcase:

- WB-TB-008
- WB-TB-015
- WB-TB-019
- WB-TB-023

---

### 3.3 Guard / Business Rule Path

Kiểm tra các điều kiện nghiệp vụ trước khi cho phép thay đổi trạng thái hoặc xóa bàn.


Các testcase:

- WB-TB-011
- WB-TB-012
- WB-TB-017
- WB-TB-018
- WB-TB-020

---

### 3.4 Default / Retention Path

Kiểm tra các giá trị mặc định hoặc giữ lại giá trị cũ.

Các testcase:

- WB-TB-003: `tableNumber = 0`
- WB-TB-004: `capacity = 0`
- WB-TB-005: QR rỗng
- WB-TB-006: status không truyền
- WB-TB-013: QR rỗng khi update
- WB-TB-014: status rỗng khi update

---

### 3.5 Exception Path

Kiểm tra khi thao tác database phát sinh exception.

Case:

- WB-TB-027 – `bulkCreate` database exception.

Mục tiêu là xác minh controller đi vào nhánh `catch` và trả response lỗi thay vì làm test process bị crash.

---

## 4. DANH SÁCH TEST CASE

### 4.1 Create Table – 7 cases

| ID | Kịch bản | Branch/Path | Result |
|---|---|---|:---:|
| WB-TB-001 | Tạo bàn thành công | Success | PASS |
| WB-TB-002 | Bàn đã tồn tại | Duplicate | PASS |
| WB-TB-003 | `tableNumber = 0` | Default | PASS |
| WB-TB-004 | `capacity = 0` | Default | PASS |
| WB-TB-005 | QR rỗng | Default QR | PASS |
| WB-TB-006 | Không truyền status | Default status | PASS |
| WB-TB-007 | Status OCCUPIED | Explicit status | PASS |

### 4.2 Update Table – 7 cases

| ID | Kịch bản | Branch/Path | Result |
|---|---|---|:---:|
| WB-TB-008 | ID không tồn tại | Not found | PASS |
| WB-TB-009 | Update thành công | Success | PASS |
| WB-TB-010 | Fallback tìm bản ghi | Fallback | PASS |
| WB-TB-011 | Có unpaid order | Guard fail | PASS |
| WB-TB-012 | Không có unpaid order | Guard pass | PASS |
| WB-TB-013 | QR rỗng | Retain old QR | PASS |
| WB-TB-014 | Status rỗng | Retain old status | PASS |

### 4.3 Update Table Status – 4 cases

| ID | Kịch bản | Branch/Path | Result |
|---|---|---|:---:|
| WB-TB-015 | ID không tồn tại | Not found | PASS |
| WB-TB-016 | OCCUPIED thành công | Success | PASS |
| WB-TB-017 | AVAILABLE không unpaid | Guard pass | PASS |
| WB-TB-018 | AVAILABLE có unpaid | Guard fail | PASS |

### 4.4 Delete Table – 4 cases

| ID | Kịch bản | Branch/Path | Result |
|---|---|---|:---:|
| WB-TB-019 | ID không tồn tại | Not found | PASS |
| WB-TB-020 | Có unfinished order | Guard fail | PASS |
| WB-TB-021 | Xóa thành công | Success | PASS |
| WB-TB-022 | Fallback tìm bàn | Fallback | PASS |

### 4.5 Get Table By QR Code – 2 cases

| ID | Kịch bản | Branch/Path | Result |
|---|---|---|:---:|
| WB-TB-023 | QR không tồn tại | Not found | PASS |
| WB-TB-024 | QR tồn tại | Success | PASS |

### 4.6 Bulk Create – 3 cases

| ID | Kịch bản | Branch/Path | Result |
|---|---|---|:---:|
| WB-TB-025 | Body không phải array | Validation | PASS |
| WB-TB-026 | Bulk create thành công | Success | PASS |
| WB-TB-027 | Database exception | Catch | PASS |

### 4.7 Get All Tables – 5 cases

| ID | Kịch bản | Branch/Path | Result |
|---|---|---|:---:|
| WB-TB-028 | Không active order/reservation | Base path | PASS |
| WB-TB-029 | Order khoảng 59 phút | Time branch | PASS |
| WB-TB-030 | Order từ 60 phút | Time branch | PASS |
| WB-TB-031 | OCCUPIED + CHECKED_IN | Reservation branch | PASS |
| WB-TB-032 | OCCUPIED không order/check-in | Fallback | PASS |

---

## 5. KẾT QUẢ THỰC THI

Lần chạy thực tế được thực hiện bằng:

```powershell
npx jest docs/testing/WhiteBox/Table_Point/Table --coverage
```

Kết quả:

```text
Test Suites: 7 passed, 7 total
Tests:       32 passed, 32 total
Snapshots:   0 total
```

### Đánh giá

| Chỉ số | Kết quả |
|---|---:|
| Test Suites PASS | 7/7 |
| Test Cases PASS | 32/32 |
| Test Cases FAIL | 0 |
| Function Coverage | 100% |
| Branch Coverage | 87.14% |
| Statement Coverage | 88.59% |
| Line Coverage | 88.59% |

---

## 6. PHÂN TÍCH CODE COVERAGE

### 6.1 Function Coverage – 100%

Tất cả các hàm được Jest ghi nhận trong phạm vi kiểm thử đều đã được gọi.

Điều này cho thấy bộ testcase đã thực thi toàn bộ các function chính của Table Controller.

### 6.2 Branch Coverage – 87.14%

Branch Coverage đạt **87.14%**.

Điều này cho thấy phần lớn các nhánh điều kiện của controller đã được kiểm thử, bao gồm:

- success
- not found
- duplicate
- default value
- unpaid order
- unfinished order
- reservation
- validation
- exception
- fallback

Tuy nhiên vẫn còn một số branch chưa được kích hoạt trong lần chạy hiện tại.

### 6.3 Statement Coverage – 88.59%

88.59% statement được thực thi.

Các statement còn lại chưa được chạy được Jest liệt kê trong phần uncovered lines.

### 6.4 Line Coverage – 88.59%

Line Coverage cũng đạt 88.59%, đồng nhất với Statement Coverage trong lần chạy được ghi nhận.

---

## 7. UNCOVERED LINES

Jest ghi nhận:

```text
67-73
89-90
113
160
201
236
253
```

Các dòng này **không được tự động coi là đã cover**.

Nếu muốn tăng coverage trong phiên bản tiếp theo, nhóm có thể phân tích từng đoạn code tương ứng và bổ sung testcase cho các path còn thiếu.

---

## 8. ĐÁNH GIÁ CHẤT LƯỢNG BỘ TEST

### Điểm đạt được

1. Toàn bộ 32 testcase đều PASS.
2. Có kiểm tra cả success path và failure path.
3. Có kiểm tra giá trị biên/default.
4. Có kiểm tra business rule liên quan order.
5. Có kiểm tra exception.
6. Có kiểm tra fallback logic.
7. Function Coverage đạt 100%.
8. Branch Coverage đạt 87.14%.

### Hạn chế

1. Coverage chưa đạt 100% ở Statements.
2. Coverage chưa đạt 100% ở Branches.
3. Coverage chưa đạt 100% ở Lines.
4. Một số dòng được Jest liệt kê chưa được thực thi.
5. Cần phân tích thêm source code tại các uncovered lines nếu muốn tăng coverage.

---

## 9. KẾT LUẬN

Bộ kiểm thử WhiteBox cho module Table đã hoàn thành lần thực thi hiện tại với:

**32/32 test cases PASS – 7/7 test suites PASS.**

Kết quả coverage:

```text
Statements : 88.59%
Branches   : 87.14%
Functions  : 100%
Lines      : 88.59%
```

Như vậy, bộ testcase đã kiểm tra được toàn bộ function chính của Table Controller và phần lớn các nhánh xử lý quan trọng. Các dòng chưa được cover được giữ nguyên theo kết quả Jest để phản ánh trung thực trạng thái kiểm thử.

**Trạng thái cuối:** PASS – hoàn thành WhiteBox Table Test Execution.

---


