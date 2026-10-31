# WHITE-BOX TEST EXECUTION RESULT – TABLE MODULE

**Dự án:** FutureSuShi – Hệ thống Đặt món & Quản lý Nhà hàng Sushi  
**Module:** Table Management / Table Controller  
**Đối tượng kiểm thử:** `backend/src/controllers/tableController.js`  
**Framework:** Jest  
**Coverage engine:** Istanbul/Jest Coverage  


---

## 1. EXECUTIVE SUMMARY

| Chỉ số | Kết quả thực tế | Đánh giá |
|---|---:|---|
| Test Suites | **7 / 7 PASS** | Đạt |
| Test Cases | **32 / 32 PASS** | Đạt |
| Failed Tests | **0** | Không có test thất bại |
| Statements Coverage | **88.59%** | Tốt |
| Branches Coverage | **87.14%** | Tốt |
| Functions Coverage | **100%** | Hoàn toàn |
| Lines Coverage | **88.59%** | Tốt |

**Kết luận nhanh:** Toàn bộ testcase WhiteBox của module Table đều thực thi thành công. Tuy nhiên, độ bao phủ mã nguồn chưa đạt 100% ở Statements, Branches và Lines; kết quả này được giữ nguyên theo báo cáo Jest thực tế.

---

## 2. TEST SUITE ĐÃ THỰC THI

| STT | Test Suite | Kết quả |
|---:|---|:---:|
| 1 | `createTable.test.js` | PASS |
| 2 | `updateTable.test.js` | PASS |
| 3 | `updateTableStatus.test.js` | PASS |
| 4 | `deleteTable.test.js` | PASS |
| 5 | `getTableByQRCode.test.js` | PASS |
| 6 | `getAllTables.test.js` | PASS |
| 7 | `bulkCreateTables.test.js` | PASS |

**Tổng:** 7/7 suites PASS.

---

## 3. CHI TIẾT 32 TEST CASE

### 3.1 `createTable`

| ID | Kịch bản | Path/Branch | Kết quả |
|---|---|---|:---:|
| WB-TB-001 | Tạo bàn khi chưa tồn tại | Success path | PASS |
| WB-TB-002 | Tạo bàn đã tồn tại | Duplicate branch | PASS |
| WB-TB-003 | `tableNumber = 0` | Default branch | PASS |
| WB-TB-004 | `capacity = 0` | Default branch | PASS |
| WB-TB-005 | QR rỗng | Default QR branch | PASS |
| WB-TB-006 | Không truyền status | Default status branch | PASS |
| WB-TB-007 | Status OCCUPIED | Explicit status branch | PASS |

**Kết quả:** 7/7 PASS.

### 3.2 `updateTable`

| ID | Kịch bản | Path/Branch | Kết quả |
|---|---|---|:---:|
| WB-TB-008 | ID không tồn tại | Not-found branch | PASS |
| WB-TB-009 | Cập nhật thành công | Success path | PASS |
| WB-TB-010 | Fallback tìm bản ghi | Fallback path | PASS |
| WB-TB-011 | Có unpaid order | Guard-fail branch | PASS |
| WB-TB-012 | Không có unpaid order | Guard-pass branch | PASS |
| WB-TB-013 | QR rỗng | Retain-current-value branch | PASS |
| WB-TB-014 | Status rỗng | Retain-current-value branch | PASS |

**Kết quả:** 7/7 PASS.

### 3.3 `updateTableStatus`

| ID | Kịch bản | Path/Branch | Kết quả |
|---|---|---|:---:|
| WB-TB-015 | ID không tồn tại | Not-found branch | PASS |
| WB-TB-016 | Chuyển OCCUPIED | Success branch | PASS |
| WB-TB-017 | AVAILABLE, không unpaid | Guard-pass branch | PASS |
| WB-TB-018 | AVAILABLE, có unpaid | Guard-fail branch | PASS |

**Kết quả:** 4/4 PASS.

### 3.4 `deleteTable`

| ID | Kịch bản | Path/Branch | Kết quả |
|---|---|---|:---:|
| WB-TB-019 | ID không tồn tại | Not-found branch | PASS |
| WB-TB-020 | Có unfinished order | Guard-fail branch | PASS |
| WB-TB-021 | Xóa thành công | Success branch | PASS |
| WB-TB-022 | Fallback tìm bàn | Fallback branch | PASS |

**Kết quả:** 4/4 PASS.

### 3.5 `getTableByQRCode`

| ID | Kịch bản | Path/Branch | Kết quả |
|---|---|---|:---:|
| WB-TB-023 | QR không tồn tại | Not-found branch | PASS |
| WB-TB-024 | QR tồn tại | Success branch | PASS |

**Kết quả:** 2/2 PASS.

### 3.6 `bulkCreateTables`

| ID | Kịch bản | Path/Branch | Kết quả |
|---|---|---|:---:|
| WB-TB-025 | Body không phải array | Validation branch | PASS |
| WB-TB-026 | Bulk create thành công | Success branch | PASS |
| WB-TB-027 | Database exception | Catch/exception branch | PASS |

**Kết quả:** 3/3 PASS.

### 3.7 `getAllTables`

| ID | Kịch bản | Path/Branch | Kết quả |
|---|---|---|:---:|
| WB-TB-028 | Không có active order/reservation | Base path | PASS |
| WB-TB-029 | Active order khoảng 59 phút | Time-format branch | PASS |
| WB-TB-030 | Active order từ 60 phút | Time-format branch | PASS |
| WB-TB-031 | OCCUPIED + CHECKED_IN | Reservation branch | PASS |
| WB-TB-032 | OCCUPIED không order/CHECKED_IN | Fallback branch | PASS |

**Kết quả:** 5/5 PASS.

---

## 4. COVERAGE RESULT

Jest báo cáo:

File                                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s               
-------------------------------------------|---------|----------|---------|---------|---------------------------------
All files                                  |   89.25 |    87.14 |     100 |   89.25 |                                 
 backend/src/controllers                   |   88.59 |    87.14 |     100 |   88.59 |                                 
  tableController.js                       |   88.59 |    87.14 |     100 |   88.59 | 67-73,89-90,113,160,201,236,253 
 docs/testing/WhiteBox/Table_Point/helpers |     100 |      100 |     100 |     100 |                                 
  testHelpers.js                           |     100 |      100 |     100 |     100 |                                 
 docs/testing/WhiteBox/Table_Point/mocks   |     100 |      100 |     100 |     100 |                                 
  tableMocks.js                            |     100 |      100 |     100 |     100 |                                 
-------------------------------------------|---------|----------|---------|---------|---------------------------------

### Coverage của `tableController.js`

| Tiêu chí | Đạt | Tổng | Tỷ lệ |
|---|---:|---:|---:|
| Statements | — | — | **88.59%** |
| Branches | — | — | **87.14%** |
| Functions | — | — | **100%** |
| Lines | — | — | **88.59%** |


---

## 5. UNCOVERED LINES

Jest ghi nhận các dòng chưa được cover:

```text
67-73
89-90
113
160
201
236
253
```

Các dòng này được giữ nguyên theo output Coverage và cần được kiểm tra thêm nếu nhóm muốn nâng coverage.

---

## 6. KẾT LUẬN EXECUTION

- **32/32 testcase PASS.**
- **7/7 test suite PASS.**
- Function Coverage đạt **100%**.
- Branch Coverage đạt **87.14%**.
- Statement Coverage đạt **88.59%**.
- Line Coverage đạt **88.59%**.
- Không có testcase thất bại trong lần thực thi.
- Vẫn còn một số dòng/nhánh chưa được thực thi và được Jest liệt kê tại `67-73, 89-90, 113, 160, 201, 236, 253`.

**Trạng thái:** PASS – hoàn thành lần thực thi WhiteBox hiện tại.
