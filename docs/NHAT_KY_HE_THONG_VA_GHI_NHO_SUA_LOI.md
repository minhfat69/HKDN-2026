# 🧠 NHẬT KÝ HỆ THỐNG & GHI NHỚ SỬA LỖI (SYSTEM MEMORY & CHANGELOG)

> **Mục đích tài liệu**: Lưu trữ toàn bộ lịch sử nâng cấp, nguyên nhân gốc rễ (Root Cause), giải pháp kỹ thuật và danh sách file đã chỉnh sửa trong dự án **FutureSuShi / AppDatMon** để đội ngũ phát triển và AI Assistant luôn đồng bộ ngữ cảnh, không bỏ sót bất kỳ chức năng nào đã trao đổi.

---

## 1. Tổng quan Kiến trúc & 5 Phân hệ (34 Use Cases UC00–UC33)

Hệ thống **FutureSuShi (AppDatMon)** sử dụng cơ sở dữ liệu MySQL `appdatmon` gồm **20 bảng** ([backend/create_db.sql](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/backend/create_db.sql)) và đáp ứng đầy đủ 5 phân hệ:

1. **Phân hệ 1 — Khách hàng & Gọi món QR / Web Delivery (UC00–UC08)**:
   - Quét QR tại bàn hoặc đặt giao hàng tận nơi (`DINE_IN` / `DELIVERY`).
   - Tìm kiếm & chọn **⭐ Thành viên (Tích điểm, giảm giá theo hạng thẻ `MEMBER`/`SILVER`/`GOLD`/`VIP`, trừ điểm thưởng)** hoặc **👤 Khách vãng lai**.
   - Áp dụng **Mã giảm giá (Voucher)** (`SUSHI50K`, `VIP10`, `WELCOME20K`), xem trước bảng tính chiết khấu.
   - Hiển thị **Menu ẩn VIP (`isSecretMenu`)** cho khách VIP.
   - Đặt bàn trực tuyến tự động nhận diện SĐT Thành viên hay Khách vãng lai và đồng bộ sang Quản lý bàn.
   - Gửi đánh giá sao + xem phản hồi chính thức từ Nhà hàng.
2. **Phân hệ 2 — Lễ tân Sảnh / Hostess (UC09–UC13)**:
   - Quản lý lịch đặt bàn trước (`Reservations`) và hàng chờ (`Waitlist`).
   - Chọn bàn trực tiếp trên dropdown hoặc sơ đồ bàn và bấm **Check-in nhận bàn** / **Xếp bàn** không bị chặn lỗi lệch khung giờ `±30 phút`.
3. **Phân hệ 3 — Thu ngân & Phục vụ POS (UC14–UC20)**:
   - Mở ca / Đóng ca thu ngân, đối soát tiền mặt thực đếm (`Shifts`).
   - Tạo đơn POS tại bàn (hỗ trợ ô **Tìm kiếm khách hàng thành viên** theo Tên, SĐT, Username và tự động đồng bộ khách từ bàn đã đặt trước).
   - Thanh toán Tiền mặt / Chuyển khoản / QR PayOS VietQR, tự động cộng điểm tích lũy (`+5%`) và nâng hạng thẻ.
   - Duyệt hủy đơn / món lỗi hao hụt bếp (`Void / Waste`) bằng **Mã PIN Quản lý (`123456`)**, tự động ghi vào **Nhật ký Log Ca Thu Ngân (`void_logs` & `shifts.note`)**.
   - In phiếu hóa đơn GTGT (`VAT 8%`).
4. **Phân hệ 4 — Màn hình Bếp KDS (UC21–UC24)**:
   - Nhận đơn thời gian thực, chuyển trạng thái `CONFIRMED` -> `PREPARING` -> `READY`.
   - Cảnh báo đơn trễ (`> 15 phút`) và tự động trừ tồn kho món ăn + trừ lô nguyên vật liệu theo chuẩn **FEFO (First Expired, First Out)**.
5. **Phân hệ 5 — Quản trị & Kho ERP tích hợp trên trang Admin (UC25–UC33)**:
   - Toàn bộ tính năng ERP được gộp trực tiếp vào trang [admin/index.html](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/index.html) ([admin/app.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/app.js)).
   - Xem & cập nhật **Số lượng tồn kho món ăn (`products.stock`)** và **Tồn kho nguyên vật liệu Barcode/FEFO (`ingredients` & `inventory_batches`)** ngay tại **Dashboard Tổng quan (`overview`)** và tab **Quản lý Kho & Tồn kho (`inventory`)**.
   - Báo cáo **Lợi nhuận P&L (Doanh thu - Giá vốn COGS - Hao hụt Waste)** và **Dự báo món ăn bán chạy ngày mai (+15%)**.

---

## 2. Chi tiết Nhật ký Sửa lỗi Đợt 1 & Đợt 2 (Tại sao lỗi & Đã sửa gì)

### 🔹 QA-01: Gộp toàn bộ trang ERP về chung trang Admin chính
- **Nguyên nhân**: Trước đó các tính năng ERP nằm tách biệt ở `/admin/erp.html` khiến người quản trị phải chuyển qua lại 2 trang.
- **Giải pháp & File đã sửa**:
  - [admin/app.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/app.js): Tích hợp 4 view `inventory` (Quản lý Kho & Tồn kho), `vouchers` (Mã giảm giá), `shifts` (Ca thu ngân & Hủy đơn PIN), và tích hợp báo cáo P&L + Dự báo vào `stats` (Thống kê doanh thu & Lợi nhuận).
  - [admin/erp.html](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/erp.html): Chuyển hướng tự động về `/admin/index.html?view=inventory`.

### 🔹 QA-02: Lỗi Lễ tân khi nhấn Check-in bàn cho khách (đã tích chọn bàn)
- **Nguyên nhân**: Backend kiểm tra cứng khoảng thời gian `±30 phút` so với giờ đặt bàn và một số nút Check-in ở Admin/Staff không truyền `table_id` đã chọn từ dropdown.
- **Giải pháp & File đã sửa**:
  - [backend/src/controllers/reservationController.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/backend/src/controllers/reservationController.js) & [backend/src/controllers/waitlistController.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/backend/src/controllers/waitlistController.js): Gỡ bỏ chặn cứng `±30 phút`, nhận `table_id` linh hoạt và tự động đổi trạng thái bàn sang `OCCUPIED`.
  - [admin/host.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/host.js), [admin/js/views/reservationsView.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/js/views/reservationsView.js), [admin/staff.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/staff.js): Thêm dropdown chọn bàn đồng bộ trực tiếp với sơ đồ bàn.

### 🔹 QA-03 & QA-06 (Mục 1 Đợt 2): Chọn Thành viên / Khách vãng lai, Voucher & Thêm Tìm kiếm (Search) Khách hàng Thành viên Tích điểm
- **Nguyên nhân**:
  1. Ở giỏ hàng khách (`customer/js/menu.js`) chỉ cho nhập đúng SĐT rồi bấm Tìm, chưa có ô tìm kiếm gợi ý danh sách thành viên theo Tên / SĐT / Username.
  2. Ở Modal Tạo đơn POS (`admin/app.js`) chỉ có dropdown danh sách khách hàng tĩnh, chưa có ô Search lọc nhanh thành viên.
  3. Ở bảng Khách hàng & Điểm tích lũy trong Admin (`admin/app.js`), khi gõ vào ô tìm kiếm thì `render()` ghi đè toàn bộ DOM làm mất con trỏ chuột (mất focus), và `app.onclick` có `case 'search-input': render()` khiến vừa click vào ô search đã bị re-render.
- **Giải pháp & File đã sửa**:
  - [backend/src/controllers/operationsController.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/backend/src/controllers/operationsController.js) & [backend/src/routes/operationsRoutes.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/backend/src/routes/operationsRoutes.js):
    - Thêm API `GET /api/ops/members/search?q=...` tìm kiếm thành viên theo Tên (`fullName`), Số điện thoại (`phone`), hoặc `username`.
    - Nâng cấp `GET /api/ops/members/lookup` hỗ trợ tìm gần đúng theo SĐT hoặc tên.
  - [customer/js/menu.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/js/menu.js):
    - Nâng cấp `#memberPhoneInput` thành ô tìm kiếm trực tiếp (`🔍 Tìm Tên, SĐT hoặc Username thành viên...`), hiển thị danh sách kết quả `#memberSearchResultsList` kèm Hạng thẻ & Số điểm để click chọn ngay.
    - Đồng bộ khóa `localStorage.getItem("appdatmon_customer_user")` để tự động nhận diện thành viên đang đăng nhập.
  - [admin/app.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/app.js):
    - Thêm ô `#posMemberSearchInput` (`[data-action="pos-member-search"]`) ngay trong Modal Tạo đơn hàng POS để lọc danh sách thành viên theo thời gian thực khi gõ Tên/SĐT.
    - Khôi phục `focus()` và vị trí con trỏ `setSelectionRange()` sau mỗi lần `render()`, đồng thời bỏ `render()` trong `case 'search-input':` của `app.onclick`.

### 🔹 QA-07 (Mục 2 Đợt 2): Ở Ca thu ngân & Hủy đơn thêm Log vào Ca thu ngân
- **Nguyên nhân**: Khi thực hiện Hủy đơn / Báo hao hụt bếp (`Void/Waste`) bằng mã PIN Quản lý, hệ thống chỉ mới đổi trạng thái đơn sang `CANCELLED` và trừ kho, chưa lưu bản ghi vào bảng `void_logs` và chưa ghi nhật ký trực tiếp vào ca thu ngân đang mở (`Shift.note`), đồng thời giao diện `shifts` chưa có bảng hiển thị lịch sử log.
- **Giải pháp & File đã sửa**:
  - [backend/src/controllers/operationsController.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/backend/src/controllers/operationsController.js) & [backend/src/routes/operationsRoutes.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/backend/src/routes/operationsRoutes.js):
    - Trong `voidOrWasteOrder`: Lưu chi tiết từng món hủy vào bảng `VoidLog` (`void_logs`) VÀ tự động nối thêm dòng nhật ký `[HH:mm:ss] HỦY ĐƠN / HAO HỤT BẾP Đơn #ID (-Số tiền) • Lý do • Duyệt PIN bởi Quản lý` vào trường `note` của Ca thu ngân đang mở (`Shift`).
    - Thêm API `GET /api/ops/shifts/logs` trả về lịch sử tất cả các ca thu ngân (`shifts`), danh sách đơn đã hủy/hao hụt (`cancelledOrders`), và chi tiết `voidLogs`.
  - [admin/app.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/app.js):
    - Trong `renderShiftsView()`: Hiển thị dòng **📝 Log trong ca** ngay trên thẻ Ca đang mở, kèm 2 bảng dữ liệu: **Nhật Ký Ca Thu Ngân (Lịch sử Mở/Đóng Ca & Đối Soát Tiền Mặt)** và **Nhật Ký Hủy Đơn / Hao Hụt Bếp (Void & Waste Audit Logs)**.

### 🔹 QA-08 (Mục 3 Đợt 2): Ở Quản lý bàn nếu có đặt bàn phải xem Khách vãng lai hay Thành viên dựa trên SĐT và đồng bộ dữ liệu
- **Nguyên nhân**: Khi khách đặt bàn, hệ thống lưu `guestPhone` vào bảng `reservations` nhưng nếu khách không đăng nhập lúc đặt bàn thì `user_id` bị `null`, và trên sơ đồ Quản lý bàn (`tablesView.js`, `staff.js`) không hiển thị bàn đó thuộc về **⭐ Thành viên** hay **👤 Khách vãng lai**.
- **Giải pháp & File đã sửa**:
  - [backend/src/controllers/reservationController.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/backend/src/controllers/reservationController.js):
    - Khi tạo đặt bàn (`createReservation`) hoặc lấy danh sách đặt bàn (`getAllReservations`), hệ thống tự động đối chiếu `guestPhone` với bảng `users`. Nếu khớp SĐT thành viên, tự động gán `user_id` và trả về `isMember: true`, `customerType: 'MEMBER'`, `memberTier`, `memberPoints`.
  - [backend/src/controllers/tableController.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/backend/src/controllers/tableController.js):
    - Trong `getAllTables`, tự động đính kèm `activeReservation` cho từng bàn kèm thông tin đối chiếu SĐT thành viên (`isMember`, `memberTier`, `memberPoints`, `User`).
  - [admin/js/views/tablesView.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/js/views/tablesView.js), [admin/js/views/reservationsView.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/js/views/reservationsView.js), [admin/staff.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/staff.js), [admin/app.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/app.js):
    - Trên từng thẻ Bàn có lịch đặt trước (và trong ngăn kéo Chi tiết bàn), hiển thị rõ khung đồng bộ: Tên khách, SĐT, Giờ đặt, và huy hiệu **⭐ Thành viên (Hạng thẻ • Điểm)** hoặc **👤 Khách vãng lai (Chưa ĐK)**.
    - Thêm nút **"🍽️ Gọi món"** ngay trên thẻ bàn để mở Modal Tạo đơn POS và **tự động điền sẵn Bàn + Tài khoản Thành viên / SĐT khách đặt bàn**. Khi đổi bàn trong Modal POS (`#orderTable`), hệ thống cũng tự động đồng bộ thông tin khách đặt bàn của bàn đó.

### 🔹 QA-09 (Mục 4 Đợt 2): Quản lý kho & Xem số lượng tồn kho ngay trong Dashboard Admin
- **Nguyên nhân**: Trên trang Dashboard Tổng quan (`overview`) của Admin trước đó chỉ có 4 thẻ KPI doanh thu/đơn hàng, chưa có bảng theo dõi số lượng tồn kho món ăn (`products.stock`) và tồn kho nguyên vật liệu (`ingredients`), khiến quản lý không nhìn thấy ngay số lượng tồn kho trên Dashboard.
- **Giải pháp & File đã sửa**:
  - [admin/app.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/admin/app.js):
    - Bổ sung khu vực **"📦 Quản lý Kho & Xem Số Lượng Tồn Kho Thực Tế (Món ăn & Nguyên vật liệu)"** ngay trên màn hình **Tổng quan Hệ thống (`renderOverview`)**:
      - 4 thẻ KPI tồn kho: Tổng món thực đơn, Tổng số lượng suất tồn kho, Số món sắp hết/hết hàng (`stock <= 5`), và Số nguyên liệu Barcode & Lô FEFO.
      - Bảng **Tồn Kho Suất Món Ăn (`products.stock`)** có nút **`+20 suất`** nạp tồn kho nhanh ngay tại Dashboard.
      - Bảng **Tồn Kho Nguyên Vật Liệu & Lô Hạn Sử Dụng (FEFO)** kèm nút mở nhanh sang tab Quản lý Kho chi tiết.
    - Trong tab **Quản lý Kho & Tồn kho (`renderInventoryView`)**: Bổ sung bảng **Quản lý & Cập nhật trực tiếp Số lượng tồn kho từng món ăn** (cho phép nhập số lượng tồn mới và bấm **Lưu** hoặc **`+20`**) bên cạnh phần Quét Barcode nhập lô nguyên liệu FEFO và Định lượng Recipe.

### 🔹 QA-04 & QA-10 (Mục 5 Đợt 2): Fix lỗi `Cannot PUT /api/reviews/9/reply` khi phản hồi đánh giá
- **Nguyên nhân**:
  1. Tiến trình `node.exe` cũ (PID `25204`) được khởi chạy từ trước khi thêm route `/api/reviews/:id/reply` vẫn đang chiếm cổng `3000`, nên mọi request `PUT /api/reviews/9/reply` đều rơi vào Express 404 mặc định (`Cannot PUT /api/reviews/9/reply`).
- **Giải pháp & File đã sửa**:
  - [backend/src/routes/reviewRoutes.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/backend/src/routes/reviewRoutes.js): Hỗ trợ đồng thời cả `PUT` và `POST` cho `/:id/reply` và `/:id/status`.
  - Đã dừng tiến trình `node.exe` cũ (PID `25204`) và khởi động lại `node backend/server.js` mới trên cổng `3000`, kiểm thử trực tiếp `PUT /api/reviews/9/reply` trả về HTTP 200 thành công.

### 🔹 QA-05 & QA-11 (Mục 6 Đợt 2): Chỉnh lại Front UI/UX của trang Khách (`customer/`) cho đẹp và đều
- **Nguyên nhân**:
  1. Ở trang chủ [customer/index.html](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/index.html), khu vực **Best Seller (Món ăn nổi bật)** dùng `<div class="feature-card hover-up"><img src="...">`, nhưng trong [customer/css/home.css](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/css/home.css) và [customer/css/layout.css](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/css/layout.css) chưa có rule `.feature-card img` (chỉ có `.food-card img`) và trong `layout.css` `.feature-card` bị gán `background: white` lệch tông với giao diện Dark Mode, làm 4 thẻ món ăn nổi bật bị lệch chiều cao ảnh và mất cân đối.
  2. Thanh điều hướng [customer/header.html](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/header.html) thiếu link trực tiếp vào trang **Thực đơn (`menu.html`)**, và nút CTA ở Hero trang chủ dẫn tới `#qr-section` (không tồn tại) thay vì mở Thực đơn hoặc Modal Quét QR.
  3. Trang Đặt bàn [customer/booking.html](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/booking.html) chưa tự điền ngày/giờ mặc định và chưa hiển thị huy hiệu nhận diện SĐT Thành viên / Khách vãng lai khi khách nhập SĐT.
- **Giải pháp & File đã sửa**:
  - [customer/css/home.css](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/css/home.css) & [customer/css/layout.css](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/css/layout.css):
    - Đồng bộ `.feature-card` sang nền tối sang trọng (`var(--panel)`), `display: flex; flex-direction: column; align-items: center; height: 100%`, và thêm `.feature-card img { width: 100%; height: 210px; object-fit: cover; border-radius: 16px; margin-bottom: 20px; }` giúp tất cả các thẻ Feature & Best Seller đều tăm tắp.
  - [customer/header.html](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/header.html) & [customer/js/app.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/js/app.js):
    - Thêm mục **Thực đơn (`menu.html`)** lên thanh Header và hiển thị cả số điểm + hạng thẻ ở góc phải Header.
  - [customer/index.html](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/index.html):
    - Cập nhật cụm nút Hero gồm: **Xem Thực đơn & Đặt món (`menu.html`)**, **Quét QR tại bàn (`#openQrBtn`)**, và **Đặt bàn (`booking.html`)**.
  - [customer/js/booking.js](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/customer/js/booking.js):
    - Tự động điền ngày hôm nay, tự động kiểm tra SĐT khi khách gõ để báo ngay **⭐ Thành viên (Hạng thẻ & Điểm - Tự động đồng bộ vào Bàn)** hay **👤 Khách vãng lai**, và cho phép xem lịch sử đặt bàn theo SĐT.
