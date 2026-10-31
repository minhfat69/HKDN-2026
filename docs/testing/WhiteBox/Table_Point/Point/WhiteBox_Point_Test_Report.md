# KẾT QUẢ THỰC THI KIỂM THỬ HỘP TRẮNG & CODE COVERAGE (TEST EXECUTION RESULT)

**Dự án:** FutureSushi - Hệ thống Đặt món & Quản lý Nhà hàng Sushi  
**Module kiểm thử:** Point Management  
**Thư mục chứa Test Suite:** `docs/testing/WhiteBox/Table_Point/Point/`  
**Đối tượng kiểm thử:** `backend/src/controllers/pointController.js`  
**Function:** `addPointsFromOrder`  
**Môi trường kiểm thử:** Node.js + Jest + Istanbul Code Coverage  
**Phương pháp:** White-Box / Structural Testing  

---

## 1. TỔNG KẾT KẾT QUẢ THỰC THI (EXECUTIVE TEST SUMMARY)

| Chỉ số tổng quan | Giá trị thực tế | Tỷ lệ đạt được | Đánh giá |
| :--- | :---: | :---: | :---: |
| **Tổng số Test Suites** | 1 / 1 Suite | **100% PASS** | Đạt yêu cầu |
| **Tổng số Test Cases** | **7 / 7 Cases** | **100% PASS** | Hoàn thành |
| **Số Test Case thất bại (Failed)** | 0 Cases | **0%** | Không có lỗi |
| **Statements Coverage** | 100% | **100%** | Đạt |
| **Branches Coverage** | 100% | **100%** | Đạt |
| **Functions Coverage** | 100% | **100%** | Đạt |
| **Lines Coverage** | 100% | **100%** | Đạt |

---

## 2. KẾT QUẢ CHI TIẾT TEST SUITE

### 2.1 `pointController.test.js` (7/7 PASS)

**Đối tượng kiểm thử:** `backend/src/controllers/pointController.js`  
**Function:** `addPointsFromOrder`  
**Kết quả Coverage:** Statements: 100% | Branches: 100% | Functions: 100% | Lines: 100%

| Test Case ID | Tên Kịch Bản Kiểm Thử | Assertion / Kỳ vọng kiểm tra | Kết quả thực tế | Trạng thái |
| :--- | :--- | :--- | :--- | :---: |
| **WB-POINT-001** | Thiếu `phone` hoặc `orderId` | `res.status(400)` và thông báo yêu cầu nhập đủ dữ liệu | HTTP 400 | **PASS** |
| **WB-POINT-002** | Không tìm thấy khách hàng | `res.status(404)` | HTTP 404, User not found | **PASS** |
| **WB-POINT-003** | Không tìm thấy hóa đơn | `res.status(404)` | HTTP 404, Order not found | **PASS** |
| **WB-POINT-004** | Đơn hàng chưa thanh toán/chưa hoàn thành | `res.status(400)` | HTTP 400 | **PASS** |
| **WB-POINT-005** | Đơn hàng đã được tích điểm | `res.status(400)` | HTTP 400 | **PASS** |
| **WB-POINT-006** | Tích điểm thành công | Increment points, update order và commit transaction | HTTP 200, commit thành công | **PASS** |
| **WB-POINT-007** | Database exception | Rollback transaction và `res.status(500)` | HTTP 500, rollback thành công | **PASS** |

---

## 3. PHÂN TÍCH CÁC PATH ĐƯỢC KIỂM THỬ

### 3.1 Validation Path

Kiểm tra điều kiện đầu vào:

```text
Request
   ↓
Thiếu phone / orderId
   ↓
HTTP 400
```

Testcase:

* **WB-POINT-001**

---

### 3.2 Not-Found Path

Kiểm tra dữ liệu không tồn tại:

```text
Request
   ↓
Tìm User / Order
   ↓
Không tìm thấy
   ↓
HTTP 404
```

Testcase:

* **WB-POINT-002**
* **WB-POINT-003**

---

### 3.3 Business Rule Path

Kiểm tra các điều kiện nghiệp vụ:

* Đơn hàng chưa thanh toán.
* Đơn hàng chưa hoàn thành.
* Đơn hàng đã được tích điểm.

Testcase:

* **WB-POINT-004**
* **WB-POINT-005**

---

### 3.4 Success Path

Kiểm tra luồng tích điểm hợp lệ:

```text
User tồn tại
   ↓
Order tồn tại
   ↓
PAID + COMPLETED
   ↓
Chưa tích điểm
   ↓
Tính điểm
   ↓
Update User + Order
   ↓
Commit transaction
   ↓
HTTP 200
```

Testcase:

* **WB-POINT-006**

---

### 3.5 Exception Path

Kiểm tra khi database phát sinh lỗi:

```text
Database Exception
       ↓
catch
       ↓
Rollback transaction
       ↓
HTTP 500
```

Testcase:

* **WB-POINT-007**

---

## 4. KẾT QUẢ CODE COVERAGE

| Loại Coverage | Kết quả |
| :--- | :---: |
| **Statements** | **100%** |
| **Branches** | **100%** |
| **Functions** | **100%** |
| **Lines** | **100%** |

### Đánh giá

* **Function Coverage – 100%:** Function `addPointsFromOrder` đã được thực thi.
* **Branch Coverage – 100%:** Các nhánh validation, not-found, business rule, success và exception đã được kiểm tra.
* **Statement Coverage – 100%:** Các statement trong phạm vi function được thực thi.
* **Line Coverage – 100%:** Các dòng code thuộc phạm vi kiểm thử đều được chạy.

---


## 5. ĐÁNH GIÁ CHẤT LƯỢNG BỘ TEST

### Điểm đạt được

* 7/7 testcase PASS.
* Có kiểm tra cả success và failure path.
* Có kiểm tra validation.
* Có kiểm tra User/Order không tồn tại.
* Có kiểm tra business rule.
* Có kiểm tra duplicate point.
* Có kiểm tra transaction commit.
* Có kiểm tra exception và rollback.
* Coverage đạt 100% trong phạm vi function được kiểm thử.

### Hạn chế

* Bộ test tập trung vào `addPointsFromOrder`.
* Coverage 100% chỉ phản ánh phạm vi Point Controller được đưa vào bộ test, không đại diện cho toàn bộ backend.
* Các dependency User, Order và Sequelize được mock để kiểm tra riêng logic controller.

---

## 6. TÀI NGUYÊN BÀN GIAO

* `pointController.test.js` – mã nguồn White-box Test.
* `WhiteBox_Point_TestCases.xlsx` – danh sách testcase.
* `WhiteBox_Point_Test_Execution_Result.json` – kết quả thực thi.
* `WhiteBox_Point_Test_Report.md` – báo cáo White-box.
* `pointMocks.js` – dữ liệu mock.
* `testHelpers.js` – helper phục vụ test.

---

## 7. KẾT LUẬN

Bộ kiểm thử White-box cho module **Point Management** đã hoàn thành với:

```text
Test Suites: 1/1 PASS
Test Cases : 7/7 PASS

Statements : 100%
Branches   : 100%
Functions  : 100%
Lines      : 100%
```

Các path chính của `addPointsFromOrder` đã được kiểm tra gồm:

* Validation.
* User Not Found.
* Order Not Found.
* Business Rule.
* Duplicate Point.
* Success.
* Exception / Rollback.

**Trạng thái cuối: PASS – hoàn thành White-box Point Test Execution.**
