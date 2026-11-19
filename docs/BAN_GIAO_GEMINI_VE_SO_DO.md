# TÀI LIỆU BÀN GIAO DỰ ÁN & PROMPT GIAO VIỆC CHO GEMINI WEB
*(Copy toàn bộ nội dung trong khung bên dưới và dán trực tiếp vào Gemini Web để Gemini hiểu 100% dự án và vẽ lần lượt các sơ đồ còn thiếu)*

---

## 📋 NỘI DUNG COPY GỬI CHO GEMINI WEB

```markdown
Bạn là Chuyên gia Phân tích Thiết kế Hệ thống Thông tin (System Analyst / Software Architect). Tôi đang hoàn thiện báo cáo đồ án **"Hệ Thống Đặt Bàn, Gọi Món Bằng Mã QR Và Quản Lý Nhà Hàng (Future Sushi / AppDatMon)"**.

Hiện tại tôi **ĐÃ CÓ** 4 nhóm tài liệu/sơ đồ sau:
1. Sơ đồ Use Case tổng quát (UC00 đến UC33).
2. Sơ đồ Use Case phân rã theo từng tác nhân.
3. Sơ đồ ERD nhánh (theo từng cụm chức năng).
4. Bảng đặc tả cơ sở dữ liệu (Database Tables - 20 bảng MySQL).

Nhiệm vụ của bạn là nắm vững toàn bộ kiến trúc, nghiệp vụ, API và cấu trúc CSDL thực tế của dự án được bàn giao dưới đây, sau đó **lập danh sách nhiệm vụ và vẽ cho tôi toàn bộ các sơ đồ còn thiếu trong báo cáo** (bằng mã Mermaid.js chuẩn, PlantUML hoặc HTML/SVG trắng-đen chuẩn UML để tôi chèn vào báo cáo Word).

---

### I. THÔNG TIN BÀN GIAO TỪ SOURCE CODE THỰC TẾ CỦA DỰ ÁN

#### 1. Công nghệ & Kiến trúc hệ thống (Tech Stack)
- **Kiến trúc**: Web Application theo mô hình Client - Server (RESTful API), phân tách 5 cổng giao diện theo vai trò.
- **Frontend**: HTML5, CSS3, TailwindCSS, Vanilla JavaScript (Fetch API), phân chia thành:
  - Cổng Khách hàng & Guest QR (`/customer`: `index.html`, `menu.html`, `booking.html`, `review.html`, `login.html`).
  - Cổng Lễ tân - Host (`/admin/host.html`).
  - Cổng Phục vụ & Thu ngân POS (`/admin/staff.html`, `staff-tables.html`, `staff-reservations.html`, `staff-points.html`).
  - Cổng Nhà bếp - KDS (`/admin/kitchen.html`).
  - Cổng Quản trị viên & Kho ERP (`/admin/index.html`, `/admin/erp.html`).
- **Backend**: Node.js, Express.js (`app.js`, `server.js`), xác thực JWT (`authMiddleware.js`: `verifyToken`, `optionalVerifyToken`), phân quyền Role-based (`CUSTOMER`, `HOST`, `STAFF`, `KITCHEN`, `ADMIN`), Cron/Service tự động dọn dẹp lịch đặt bàn quá hạn (`reservationCleanup.js`).
- **Database**: MySQL kết hợp Sequelize ORM (20 bảng).
- **Tích hợp bên thứ 3**: Cổng thanh toán trực tuyến **PayOS** (Tạo link/mã VietQR động, đối soát trạng thái thanh toán qua Webhook).

---

#### 2. Danh sách 6 Tác nhân (Actors) & 34 Use Cases (UC00 – UC33)
1. **Guest (Khách vãng lai ăn tại bàn - không cần đăng nhập)**:
   - `UC01`: Quét mã QR định danh bàn (`tableNumber`, `qrCode`) vào thẳng thực đơn.
   - `UC02`: Gọi món trực tuyến kèm ghi chú món (ít cay, không hành...).
   - `UC03`: Theo dõi trạng thái đơn hàng tạm thời theo thời gian thực (`PENDING` -> `CONFIRMED` -> `PREPARING` -> `READY`).
   - `UC04`: Yêu cầu thanh toán tại bàn (Tiền mặt hoặc Quét QR PayOS).
2. **Customer (Khách hàng thành viên - Kế thừa toàn bộ chức năng của Guest)**:
   - `UC05`: Đăng ký tài khoản | `UC06`: Đăng nhập | `UC11`: Đăng xuất | `UC00`: Quản lý tài khoản (`UC00.1`: Cập nhật thông tin, `UC00.2`: Đổi mật khẩu).
   - `UC07`: Đặt hàng giao tận nơi **Web Delivery** (Bắt buộc nhập `deliveryAddress`, `recipientPhone` và **thanh toán trả trước 100% qua PayOS** chống bom hàng).
   - `UC08`: Đặt bàn trước trực tuyến (`Reservation`).
   - `UC09`: Xem hạng thành viên & ưu đãi (`MEMBER` 0%, `SILVER/BAC` giảm 3%, `GOLD/VANG` giảm 5%, `VIP` giảm 10% + mở khóa **Menu ẩn `isSecretMenu`**).
   - `UC10`: Xem lịch sử đơn hàng & Đánh giá món ăn (1–5 sao).
3. **Host (Lễ tân / Quản lý sảnh)**:
   - `UC12`: Quản lý danh sách đặt bàn trước & Check-in khách đến (`PENDING` -> `CONFIRMED` -> `ARRIVED` -> `CHECKED_IN`).
   - `UC13`: Xếp hàng chờ (**Waitlist**) cho khách vãng lai khi hết bàn, tính thời gian chờ dự kiến (`estimatedWaitMinutes`) và gán bàn khi có bàn trống (`WAITING` -> `NOTIFIED` -> `SEATED` / `NO_SHOW` / `CANCELLED`).
   - `UC14`: Điều phối sơ đồ bàn trực quan theo **4 màu trạng thái** (`AVAILABLE` - Trống, `BOOKED` - Đã đặt, `OCCUPIED` - Đang có khách, `CLEANING` - Đang dọn bàn).
4. **Staff (Nhân viên Phục vụ & Thu ngân)**:
   - `UC15`: Nhận thông báo & Xác nhận đơn của khách để đẩy xuống Bếp KDS.
   - `UC16`: Tạo đơn thủ công tại quầy POS (`DINE_IN` hoặc `TAKEAWAY`).
   - `UC17`: Gom đơn, áp mã giảm giá (`Voucher`), chiết khấu hạng thành viên, tính tiền thừa / tạo mã QR PayOS.
   - `UC18`: In hóa đơn chuyên nghiệp có tính thuế **VAT 8%** (`vatRate`, `vatAmount`).
   - `UC19`: Quản lý Ca làm việc (`Shift`): Mở ca (`openingCash`), Đóng ca đối soát tiền mặt thực tế (`closingCashActual` vs `expectedCash` -> tính chênh lệch `discrepancy`).
5. **Kitchen (Nhà bếp - Màn hình KDS)**:
   - `UC20`: Xem danh sách món cần chế biến trên màn hình KDS.
   - `UC21`: Cập nhật trạng thái từng món (`WAITING` -> `COOKING` -> `DONE`) và trạng thái đơn (`PREPARING` -> `READY`).
   - `UC22`: Báo hết món khẩn cấp (ẩn món `isAvailable = false` ngay lập tức trên thực đơn).
6. **Admin (Quản trị viên / Chủ nhà hàng)**:
   - `UC26`: Quản lý danh mục (`Category`) | `UC27`: Quản lý thực đơn (`Product`, giá bán `price`, giá vốn `costPrice`, món VIP `isSecretMenu`) | `UC28`: Quản lý bàn & Tạo mã QR | `UC29`: Quản lý nhân sự & Phân quyền.
   - `UC30`: Quản lý Tồn kho & Nhập hàng ERP:
     - `UC30.1`: Quét mã vạch (`barcode`) nhập kho nhanh theo lô (`InventoryBatch`).
     - `UC30.2`: Quản lý ngày sản xuất (`mfgDate`), hạn sử dụng (`expDate`) và gợi ý/tự động xuất kho theo nguyên tắc **FEFO (First Expired, First Out - Lô hết hạn trước xuất trước)**.
     - `UC30.3`: Thiết lập định lượng công thức món ăn (`Recipe` / `recipe_items`) và **tự động trừ kho nguyên liệu theo lô FEFO** khi đơn hàng hoàn tất hoặc khi hủy hao hụt bếp.
   - `UC31`: Báo cáo Lợi nhuận **P&L (Profit & Loss)**: Tổng doanh thu (`totalRevenue`), Tổng giảm giá (`totalDiscount`), Giá vốn hàng bán (`totalCOGS`), Chi phí hao hụt (`wasteCost`), Lợi nhuận gộp (`grossProfit`) & Biên lợi nhuận (`profitMargin`).
   - `UC32`: Biểu đồ xu hướng & Dự báo số lượng món bán chạy ngày mai (`forecastTomorrowQty = ceil(soldQty * 1.15)`) nhắc kho chuẩn bị nguyên liệu.
   - `UC33`: Kiểm duyệt Đánh giá (`VISIBLE` / `HIDDEN`) & Quản lý chiến dịch Voucher.
   - **Các Use Case trung tâm**:
     - `UC23`: Quản lý đơn hàng (`UC23.1`: Xem chi tiết, `UC23.2`: Cập nhật trạng thái, `UC23.3`: **Hủy món / Hao hụt (Void / Waste) bắt buộc xác thực bằng mã PIN Quản lý** — nếu `Void` (khách trả món chưa làm) thì hoàn lại `stock`, nếu `Waste` (bếp làm hỏng) thì trừ kho nguyên liệu theo Recipe và ghi nhận chi phí hao hụt vào P&L).
     - `UC24`: Thanh toán (`UC24.1`: Tiền mặt `CASH`, `UC24.2`: Chuyển khoản/QR qua `PAYOS`).
     - `UC25`: Tích điểm & Thăng hạng thành viên (`UC25.1`: Sử dụng điểm thưởng `pointsUsed` hoặc `Voucher`).

---

#### 3. Cấu trúc 20 Bảng Cơ sở dữ liệu & Quan hệ (Database Schema)
1. `users`: `id`, `fullName`, `email`, `phone`, `username`, `password`, `avatar`, `points`, `totalSpent`, `role` (`CUSTOMER`,`HOST`,`STAFF`,`KITCHEN`,`ADMIN`), `tier` (`MEMBER`,`SILVER`,`GOLD`,`VIP`), `membershipTier` (`BAC`,`VANG`,`VIP`), `pinCode`, `status` (`ACTIVE`,`BLOCKED`).
2. `restaurant_tables`: `id`, `tableNumber`, `qrCode`, `capacity`, `status` (`AVAILABLE`,`BOOKED`,`OCCUPIED`,`CLEANING`).
3. `categories`: `id`, `name`, `description`, `image`.
4. `products`: `id`, `category_id` (FK), `name`, `description`, `price`, `costPrice`, `image`, `stock`, `isAvailable`, `isSecretMenu`.
5. `reservations`: `id`, `user_id` (FK), `table_id` (FK), `guestName`, `guestPhone`, `reservationTime`, `numberOfGuests`, `note`, `status` (`PENDING`,`CONFIRMED`,`ARRIVED`,`CHECKED_IN`,`COMPLETED`,`CANCELLED`,`EXPIRED`).
6. `waitlist`: `id`, `table_id` (FK), `guestName`, `guestPhone`, `partySize`, `note`, `estimatedWaitMinutes`, `notifiedAt`, `seatedAt`, `status` (`WAITING`,`NOTIFIED`,`SEATED`,`CANCELLED`,`NO_SHOW`).
7. `vouchers`: `id`, `code`, `discountType` (`PERCENT`,`FIXED`), `discountValue`, `discountPercent`, `minOrderValue`, `maxDiscount`, `usageLimit`, `usedCount`, `expiredAt`, `isActive`, `status`.
8. `orders`: `id`, `user_id` (FK), `table_id` (FK), `reservation_id` (FK), `voucher_id` (FK), `voucherCode`, `orderType` (`DINE_IN`,`DELIVERY`,`TAKEAWAY`), `deliveryAddress`, `recipientPhone`, `totalPrice`, `discountAmount`, `pointsUsed`, `vatRate` (8%), `vatAmount`, `finalPrice`, `note`, `cancelReason`, `isWaste`, `isRecipeDeducted`, `status` (`PENDING`,`CONFIRMED`,`PREPARING`,`READY`,`COMPLETED`,`CANCELLED`), `paymentStatus` (`UNPAID`,`PAID`), `paymentMethod` (`CASH`,`PAYOS`), `isPointsAdded`.
9. `order_items`: `id`, `order_id` (FK), `product_id` (FK), `quantity`, `unitPrice`, `totalPrice`, `note`, `status` (`WAITING`,`COOKING`,`DONE`,`CANCELLED`).
10. `payments`: `id`, `order_id` (FK), `amount`, `paymentMethod` (`CASH`,`PAYOS`), `transactionCode`, `status` (`PENDING`,`SUCCESS`,`FAILED`), `paidAt`.
11. `carts`: `id`, `user_id` (FK), `totalPrice`.
12. `cart_items`: `id`, `cart_id` (FK), `product_id` (FK), `quantity`, `unitPrice`, `note`.
13. `reviews`: `id`, `user_id` (FK), `phone`, `dish_name`, `content`, `rating` (1..5), `status` (`VISIBLE`,`HIDDEN`).
14. `notifications`: `id`, `user_id` (FK), `title`, `content`, `type` (`ORDER`,`PAYMENT`,`POINT`,`PROMOTION`,`SYSTEM`), `is_read`.
15. `ingredients`: `id`, `barcode`, `name`, `unit`, `totalQuantity`/`currentStock`, `costPerUnit`, `minThreshold`/`minStock`.
16. `inventory_batches`: `id`, `ingredient_id` (FK), `batchCode`/`lotNumber`, `barcode`, `quantityImported`/`quantityReceived`, `quantityRemaining`, `unitCost`, `mfgDate`, `expDate`.
17. `inventory_transactions`: `id`, `ingredient_id` (FK), `batch_id` (FK), `type` (`IN`,`OUT`), `quantity`, `unit`, `note`, `transactionDate`.
18. `recipes` (và `recipe_items`): `id`, `product_id` (FK), `ingredient_id` (FK), `amountRequired`/`quantityNeeded`, `unit`.
19. `shifts`: `id`, `staff_id` (FK), `openedAt`, `closedAt`, `openingCash`, `closingCashActual`, `expectedCash`, `discrepancy`, `status` (`OPEN`,`CLOSED`), `note`.
20. `void_logs`: `id`, `order_item_id` (FK), `type` (`VOID`,`WASTE`), `reason`, `quantity`, `authorizedBy` (FK -> `users.id`).

---

### II. DANH SÁCH CÁC SƠ ĐỒ CÒN THIẾU CẦN BẠN VẼ LẦN LƯỢT

Vì tôi đã có **Use Case tổng quát**, **Use Case phân rã tác nhân**, **ERD nhánh** và **Bảng Database**, hãy giúp tôi vẽ các sơ đồ còn thiếu sau đây theo chuẩn UML 2.5 (trình bày rõ ràng bằng Mermaid.js hoặc HTML/SVG để tôi xuất ảnh chèn vào Word):

1. **Sơ đồ Kiến trúc Hệ thống & Triển khai (System Architecture & Deployment Diagram)**:
   - Thể hiện 5 Client UI (Guest/Customer, Host, Staff POS, Kitchen KDS, Admin ERP) -> Express REST API & Middlewares (JWT Auth, Role Guard, Cron Cleanup) -> Sequelize ORM -> MySQL Database & Tích hợp PayOS Payment Gateway.
2. **Sơ đồ ERD Tổng thể (Full Physical/Logical ERD - Kết nối đủ 20 bảng)**:
   - Ghép toàn bộ các nhánh ERD lại thành 1 sơ đồ tổng thể có đầy đủ khóa chính (PK), khóa ngoại (FK) và bản số quan hệ (`1-1`, `1-N`).
3. **Sơ đồ Lớp (UML Class Diagram)**:
   - Thể hiện các lớp thực thể (Entities) và các lớp điều khiển chính (`AuthController`, `OrderController`, `OperationsController`, `ReservationController`, `WaitlistController`, `PayosController`, `TableController`, `PointController`) kèm thuộc tính, phương thức và mũi tên quan hệ.
4. **Bộ 6 Sơ đồ Tuần tự (UML Sequence Diagrams) cho các luồng nghiệp vụ quan trọng nhất**:
   - **SD01**: Khách vãng lai (Guest) quét QR tại bàn & gọi món -> Staff xác nhận -> Kitchen KDS chế biến & báo hoàn tất (UC01, UC02, UC15, UC20, UC21).
   - **SD02**: Khách hàng thành viên đặt **Web Delivery** trả trước 100% qua cổng **PayOS** -> Webhook xác nhận -> Tự động trừ kho nguyên liệu theo lô **FEFO** (UC07, UC24.2, UC30.2, UC30.3).
   - **SD03**: Lễ tân (Host) quản lý Đặt bàn trước, Xếp hàng chờ (**Waitlist**) và Check-in đổi màu bàn trên sơ đồ 4 trạng thái (UC08, UC12, UC13, UC14).
   - **SD04**: Thu ngân (Staff) thanh toán tại quầy: Áp dụng Voucher & chiết khấu Hạng thành viên (`SILVER`/`GOLD`/`VIP`), tính thuế VAT 8%, thanh toán PayOS/Tiền mặt, cộng điểm & tự động nâng hạng thành viên (UC17, UC18, UC24, UC25, UC25.1).
   - **SD05**: Xử lý **Hủy món / Hao hụt (Void / Waste)** có xác thực mã PIN Quản lý (`managerPin`) -> Hoàn kho (`Void`) hoặc Trừ kho nguyên liệu + ghi nhận hao hụt (`Waste`) (UC23.3).
   - **SD06**: Admin quét mã vạch (`Barcode`) nhập lô hàng mới (`mfgDate`, `expDate`, `unitCost`) & truy xuất Báo cáo Lợi nhuận P&L + Dự báo bán hàng (UC30.1, UC31, UC32).
5. **Bộ 4 Sơ đồ Hoạt động (UML Activity Diagrams - Có chia cột Swimlane theo Actor/Hệ thống)**:
   - **AD01**: Quy trình phục vụ khách ăn tại quán khép kín (Từ lúc khách đến -> Host xếp bàn/Waitlist -> Quét QR gọi món -> Bếp nấu -> Thu ngân thanh toán -> Dọn bàn `CLEANING` -> `AVAILABLE`).
   - **AD02**: Quy trình đặt hàng Web Delivery & Thanh toán trực tuyến PayOS.
   - **AD03**: Quy trình Quản lý Kho thông minh (Nhập kho Barcode -> Kiểm tra hạn dùng FEFO -> Tự động trừ định lượng Recipe khi hoàn tất đơn).
   - **AD04**: Quy trình Mở ca, Thu tiền và Đóng ca đối soát tiền mặt cuối ngày của Thu ngân (`Shift Management`).
6. **Bộ 3 Sơ đồ Trạng thái (UML State Machine Diagrams)**:
   - **SM01**: Sơ đồ trạng thái của **Bàn ăn (`RestaurantTable`)**: `AVAILABLE` <-> `BOOKED` -> `OCCUPIED` -> `CLEANING` -> `AVAILABLE`.
   - **SM02**: Sơ đồ trạng thái của **Đơn hàng (`Order`) & Món ăn trong đơn (`OrderItem`)**: `PENDING` -> `CONFIRMED` -> `PREPARING` (`WAITING` -> `COOKING`) -> `READY` (`DONE`) -> `COMPLETED` / `CANCELLED` (`VOID`/`WASTE`).
   - **SM03**: Sơ đồ trạng thái của **Lịch đặt bàn (`Reservation`) & Hàng chờ (`Waitlist`)**.

**Yêu cầu cách làm việc:**
- Trước tiên, hãy xác nhận bạn đã nắm rõ toàn bộ thông tin dự án và lập bảng kế hoạch thực hiện.
- Sau đó, hãy vẽ chi tiết từng nhóm sơ đồ từ (1) đến (6) để đảm bảo không bị cắt bớt nội dung và đạt chất lượng cao nhất cho báo cáo tốt nghiệp.
```
