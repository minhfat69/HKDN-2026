# BẢNG PHÂN CÔNG VẼ CÁC SƠ ĐỒ CÒN THIẾU (4 THÀNH VIÊN)
**Dự án:** Hệ Thống Đặt Bàn, Gọi Món Bằng Mã QR Và Quản Lý Nhà Hàng (*Future Sushi / AppDatMon*)

> **✅ CÁC PHẦN ĐÃ CÓ (KHÔNG VẼ LẠI):**
> 1. Sơ đồ Use Case tổng quát (UC00 – UC33)
> 2. Sơ đồ Use Case phân rã theo tác nhân & từng chức năng
> 3. Sơ đồ ERD nhánh rễ
> 4. Bảng đặc tả Database (20 bảng)

---

## 🎯 CÁC SƠ ĐỒ THỰC SỰ CÒN THIẾU CẦN VẼ (CHIA ĐỀU CHO 4 NGƯỜI)
Trong báo cáo Phân tích & Thiết kế Hệ thống, sau khi đã có Use Case, ERD và Bảng CSDL, các phần còn thiếu chỉ gồm:
1. **Activity Diagram** (Sơ đồ hoạt động)
2. **Sequence Diagram** (Sơ đồ tuần tự)
3. **Class Diagram** (Sơ đồ lớp)
4. **State Machine & System Architecture** (Sơ đồ trạng thái & Kiến trúc hệ thống)

| STT | Thành viên | Phân hệ phụ trách | Các sơ đồ cần vẽ (Không trùng phần đã có) |
| :-: | :--- | :--- | :--- |
| **1** | **Công Thịnh** | **Kiến trúc + Tài khoản + Đặt bàn & Lễ tân (Host / Waitlist)** | • 1 Sơ đồ Kiến trúc hệ thống<br>• 2 Activity Diagram (Đăng nhập & Đặt bàn/Waitlist)<br>• 2 Sequence Diagram (Đăng nhập & Host Check-in/Waitlist) |
| **2** | **Minh Trí** | **Khách Quét QR tại bàn (Guest) + Web Delivery + Nhà bếp (KDS)** | • 2 Activity Diagram (Quét QR gọi món & Web Delivery)<br>• 2 Sequence Diagram (Quét QR/Bếp KDS & Web Delivery)<br>• 1 State Machine Diagram (Trạng thái Bàn 4 màu & Đơn hàng) |
| **3** | **Khả Hào** | **Thu ngân POS + Thanh toán PayOS + Ca làm việc + Hủy món PIN + Điểm/Voucher** | • 2 Activity Diagram (Thanh toán VAT/PayOS & Mở-Đóng ca/Hủy món PIN)<br>• 2 Sequence Diagram (Thanh toán PayOS/Tích điểm & Hủy món PIN Void/Waste)<br>• 1 State Machine Diagram (Trạng thái Thanh toán, Ca & Voucher) |
| **4** | **Trà Lưu** | **Sơ đồ Lớp (Class Diagram) + Kho ERP (Barcode, FEFO, Recipe) + Báo cáo P&L** | • 1 Class Diagram (Sơ đồ lớp thực thể & điều khiển)<br>• 2 Activity Diagram (Nhập kho Barcode & Tự động trừ kho Recipe FEFO)<br>• 2 Sequence Diagram (Nhập kho/Trừ kho FEFO & Báo cáo Lợi nhuận P&L) |

---

## 👤 1. CÔNG THỊNH (Kiến trúc + Tài khoản + Đặt bàn & Lễ tân Host)
1. **Sơ đồ Kiến trúc Hệ thống (System Architecture Diagram)**:
   - 5 giao diện Web (`Guest/Customer`, `Host`, `Staff POS`, `Kitchen KDS`, `Admin ERP`) $\leftrightarrow$ Backend Node.js/Express (`REST API`, `JWT Middleware`, `reservationCleanup`) $\leftrightarrow$ Sequelize ORM $\leftrightarrow$ MySQL & Cổng thanh toán `PayOS`.
2. **Activity Diagram 1 — Đăng ký, Đăng nhập & Phân quyền 5 vai trò (UC00, UC05, UC06)**:
   - Kiểm tra tài khoản (`ACTIVE`/`BLOCKED`), mã hóa mật khẩu `bcrypt`, cấp `JWT Token` và điều hướng theo `role` (`CUSTOMER`, `HOST`, `STAFF`, `KITCHEN`, `ADMIN`).
3. **Activity Diagram 2 — Đặt bàn trước, Xếp hàng chờ (Waitlist) & Lễ tân Check-in bàn (UC08, UC12, UC13, UC14)**:
   - Luồng khách đặt bàn trước (`PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `ARRIVED` $\rightarrow$ `CHECKED_IN` / quá giờ tự động `EXPIRED`) và luồng khách vãng lai vào hàng chờ `waitlist` (`WAITING` $\rightarrow$ `NOTIFIED` $\rightarrow$ `SEATED`), cập nhật màu bàn sang `OCCUPIED`.
4. **Sequence Diagram 1 — Xác thực Đăng nhập & Quản lý tài khoản (UC00, UC06)**:
   - `Actor` $\rightarrow$ `Login UI` $\rightarrow$ `AuthController` $\rightarrow$ `UserController` $\rightarrow$ `MySQL (users)`.
5. **Sequence Diagram 2 — Lễ tân (Host) Xếp hàng chờ Waitlist & Điều phối sơ đồ bàn 4 màu (UC12, UC13, UC14)**:
   - `Host` $\rightarrow$ `Host UI (host.html)` $\rightarrow$ `ReservationController / WaitlistController / TableController` $\rightarrow$ `MySQL (reservations, waitlist, restaurant_tables)`.

---

## 👤 2. MINH TRÍ (Khách Quét QR tại bàn + Web Delivery + Nhà bếp KDS)
1. **Activity Diagram 1 — Khách quét QR gọi món tại bàn $\rightarrow$ Staff xác nhận $\rightarrow$ Bếp KDS chế biến (UC01, UC02, UC15, UC20, UC21, UC22)**:
   - Khách quét QR định danh bàn (`tableNumber`) $\rightarrow$ Xem menu (khách `VIP` mở khóa thêm món ẩn `isSecretMenu = true`) $\rightarrow$ Chọn món + ghi chú $\rightarrow$ Staff xác nhận (`CONFIRMED`) $\rightarrow$ Bếp KDS nấu (`COOKING` $\rightarrow$ `DONE` / `READY`) hoặc báo hết món khẩn cấp (`isAvailable = false`).
2. **Activity Diagram 2 — Đặt đơn giao hàng Web Delivery trả trước 100% chống bom hàng (UC07)**:
   - Khách thành viên nhập `deliveryAddress` & `recipientPhone` $\rightarrow$ Tính thuế VAT 8% $\rightarrow$ Bắt buộc thanh toán trả trước 100% qua `PAYOS` $\rightarrow$ Đơn tự động chuyển `CONFIRMED` & `PAID`, đồng thời tự động trừ kho nguyên liệu theo công thức.
3. **Sequence Diagram 1 — Quét QR gọi món tại bàn & Bếp KDS cập nhật trạng thái món (UC01, UC02, UC15, UC21, UC22)**:
   - `Guest` $\rightarrow$ `Menu UI` $\rightarrow$ `Staff UI` $\rightarrow$ `Kitchen KDS UI` $\rightarrow$ `OrderController / ProductController` $\rightarrow$ `MySQL (restaurant_tables, products, orders, order_items)`.
4. **Sequence Diagram 2 — Đặt hàng Web Delivery & Thanh toán trả trước 100% (UC07, UC24.2)**:
   - `Customer` $\rightarrow$ `Customer Web` $\rightarrow$ `OperationsController (createDeliveryOrder)` $\rightarrow$ `PayOS Gateway` $\rightarrow$ `MySQL (products, orders, order_items, payments)`.
5. **State Machine Diagram — Sơ đồ Trạng thái Bàn ăn (4 màu) & Đơn hàng / Món ăn**:
   - Bàn ăn (`restaurant_tables.status`): `AVAILABLE` $\rightarrow$ `BOOKED` $\rightarrow$ `OCCUPIED` $\rightarrow$ `CLEANING` $\rightarrow$ `AVAILABLE`.
   - Đơn hàng (`orders.status`): `PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `PREPARING` $\rightarrow$ `READY` $\rightarrow$ `COMPLETED` / `CANCELLED`.

---

## 👤 3. KHẢ HÀO (Thu ngân POS + Thanh toán PayOS + Ca làm việc + Hủy món PIN + Điểm/Voucher)
1. **Activity Diagram 1 — Thu ngân Thanh toán, Áp dụng Voucher/Hạng thành viên, In bill VAT 8% & Tích điểm thăng hạng (UC17, UC18, UC24, UC25, UC25.1)**:
   - Kiểm tra hạng thành viên (`MEMBER`: 0%, `SILVER/BAC`: 3%, `GOLD/VANG`: 5%, `VIP`: 10%) + kiểm tra mã `Voucher` $\rightarrow$ Tính `vatAmount` (8%) & `finalPrice` $\rightarrow$ Thanh toán `CASH` hoặc `PAYOS` (VietQR) $\rightarrow$ Cộng điểm `points`, cộng `totalSpent`, xét thăng hạng tự động, in bill VAT và chuyển bàn sang `CLEANING`.
2. **Activity Diagram 2 — Mở/Đóng ca đối soát tiền mặt (UC19) & Hủy món/Hao hụt bằng mã PIN Quản lý (UC23.3)**:
   - Mở ca (`openingCash`) $\rightarrow$ Đóng ca nhập `closingCashActual`, đối soát với `expectedCash` để tính chênh lệch `discrepancy`.
   - Hủy món/đơn cần nhập `managerPin` (Mã PIN Admin): Nếu `Void` (khách đổi ý khi bếp chưa làm) thì hoàn lại `products.stock`; nếu `Waste` (bếp làm hỏng) thì trừ kho nguyên liệu theo Recipe và ghi nhận hao hụt vào P&L.
3. **Sequence Diagram 1 — Thanh toán qua cổng PayOS (Webhook đối soát) & Tích điểm thăng hạng (UC17, UC24.2, UC25)**:
   - `Customer/Staff` $\rightarrow$ `POS UI` $\rightarrow$ `OperationsController (previewDiscount)` $\rightarrow$ `PayosController / PaymentController` $\rightarrow$ `PayOS Server` $\rightarrow$ `PointController` $\rightarrow$ `MySQL (orders, payments, vouchers, users)`.
4. **Sequence Diagram 2 — Duyệt Hủy món / Hao hụt bằng mã PIN Quản lý (UC23.3) & Đóng ca thu ngân (UC19)**:
   - `Staff` $\rightarrow$ `Admin (Nhập PIN)` $\rightarrow$ `POS UI` $\rightarrow$ `OperationsController (voidOrWasteOrder, openShift, closeShift)` $\rightarrow$ `MySQL (orders, order_items, products, void_logs, shifts, payments)`.
5. **State Machine Diagram — Sơ đồ Trạng thái Thanh toán (`payments`), Ca làm việc (`shifts`) & Đặt bàn/Hàng chờ (`reservations`/`waitlist`)**:
   - `payments.status` (`PENDING` $\rightarrow$ `SUCCESS` / `FAILED`), `shifts.status` (`OPEN` $\rightarrow$ `CLOSED`), `waitlist.status` (`WAITING` $\rightarrow$ `NOTIFIED` $\rightarrow$ `SEATED` / `NO_SHOW` / `CANCELLED`).

---

## 👤 4. TRÀ LƯU (Sơ đồ Lớp Class Diagram + Kho ERP Barcode/FEFO/Recipe + Báo cáo P&L)
1. **Class Diagram — Sơ đồ Lớp UML của Hệ thống**:
   - Biểu diễn các lớp Models (`User`, `RestaurantTable`, `Category`, `Product`, `Reservation`, `Waitlist`, `Order`, `OrderItem`, `Payment`, `Voucher`, `Review`, `Ingredient`, `InventoryBatch`, `InventoryTransaction`, `Recipe`, `Shift`, `VoidLog`) và các lớp Controllers chính kèm thuộc tính, phương thức và mối quan hệ.
2. **Activity Diagram 1 — Quét Barcode nhập kho theo lô & Kiểm soát hạn dùng MFG/EXP (UC30, UC30.1, UC30.2)**:
   - Quét mã `barcode` $\rightarrow$ Nhập số lượng, giá vốn `unitCost`, ngày sản xuất `mfgDate`, hạn sử dụng `expDate` $\rightarrow$ Tạo lô `inventory_batches` (`LOT-{barcode}-{timestamp}`), cập nhật tồn kho `ingredients.totalQuantity`, ghi phiếu `inventory_transactions (IN)` và gợi ý lô xuất trước theo hạn dùng gần nhất (**FEFO**).
3. **Activity Diagram 2 — Tự động trừ kho nguyên liệu theo Công thức (Recipe) & Nguyên tắc FEFO khi hoàn thành đơn (UC30.2, UC30.3)**:
   - Khi đơn `COMPLETED` hoặc hủy `isWaste = true` $\rightarrow$ Tra bảng `recipes` lấy định lượng từng nguyên liệu của món ăn $\rightarrow$ Tìm các lô `inventory_batches` còn hàng sắp xếp theo `expDate ASC` (hết hạn trước trừ trước) $\rightarrow$ Trừ dần từng lô, giảm `totalQuantity` và đánh dấu `isRecipeDeducted = true`.
4. **Sequence Diagram 1 — Quét Barcode nhập lô hàng mới & Tự động trừ kho FEFO theo Recipe (`importStockByBarcode` & `deductIngredientsByOrder` - UC30.1, UC30.2, UC30.3)**:
   - `Admin / System` $\rightarrow$ `ERP UI` $\rightarrow$ `OperationsController` $\rightarrow$ `Recipe` $\rightarrow$ `Ingredient` $\rightarrow$ `InventoryBatch (ORDER BY expDate ASC)`.
5. **Sequence Diagram 2 — Truy xuất Báo cáo Lợi nhuận P&L, Dự báo món bán chạy ngày mai (UC31, UC32) & Kiểm duyệt Đánh giá (UC33)**:
   - `Admin` $\rightarrow$ `Admin Dashboard UI` $\rightarrow$ `OperationsController (getPnLAndForecast) / ReviewController` $\rightarrow$ `MySQL (orders, order_items, products, reviews)`.
   - Tính `totalRevenue`, `totalCOGS` (Giá vốn), `wasteCost` (Chi phí hao hụt bếp), `grossProfit` (Lợi nhuận gộp) và `forecastTomorrowQty = ceil(soldQty * 1.15)`.
