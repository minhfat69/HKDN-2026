# 📋 BẢNG THEO DÕI & NGHIỆM THU SỬA LỖI (QA TEST TRACKER)

> Chi tiết kỹ thuật về nguyên nhân và giải pháp sửa lỗi được lưu tại [NHAT_KY_HE_THONG_VA_GHI_NHO_SUA_LOI.md](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/docs/NHAT_KY_HE_THONG_VA_GHI_NHO_SUA_LOI.md).

## Đợt 2 — 7 Hạng mục đã sửa & kiểm thử thành công (7/7 ✅)

| Tick | Mã | Hạng mục / Chức năng | Giải pháp đã thực hiện | Kết quả |
| :---: | :---: | :--- | :--- | :---: |
| `[x]` | **QA-06** | **1. Search khách hàng thành viên tích điểm** | Thêm API `GET /api/ops/members/search?q=...`, ô tìm kiếm thành viên trực tiếp (theo Tên, SĐT, Username) trong Giỏ hàng khách (`customer/js/menu.js`), trong Modal Tạo đơn POS (`admin/app.js`), và sửa lỗi mất focus con trỏ khi gõ tìm kiếm ở các bảng Admin. | ✅ **PASS** |
| `[x]` | **QA-07** | **2. Thêm Log vào Ca thu ngân & Hủy đơn** | Ghi log hủy đơn/hao hụt bếp (`Void/Waste`) vào bảng `void_logs` và nối trực tiếp vào `Shift.note` của ca thu ngân đang mở; hiển thị bảng **Nhật Ký Ca Thu Ngân** và **Nhật Ký Hủy Đơn / Hao Hụt Bếp** trong tab `Ca thu ngân & Hủy PIN` (`admin/app.js`). | ✅ **PASS** |
| `[x]` | **QA-08** | **3. Quản lý bàn đồng bộ đặt bàn (Thành viên vs Khách vãng lai theo SĐT)** | Tự động đối chiếu `guestPhone` của đơn đặt bàn với bảng `users` để hiển thị huy hiệu **⭐ Thành viên (Hạng thẻ • Điểm)** hoặc **👤 Khách vãng lai** ngay trên thẻ Bàn (`tablesView.js`, `staff.js`) và đồng bộ thông tin khách khi bấm **"🍽️ Gọi món"** cho bàn đó. | ✅ **PASS** |
| `[x]` | **QA-09** | **4. Quản lý kho & Xem số lượng tồn kho trong Dashboard Admin** | Hiển thị khu vực **Quản lý Kho & Xem Số Lượng Tồn Kho Thực Tế** (cả tồn kho suất món ăn `products.stock` kèm nút nạp nhanh `+20 suất` và tồn kho nguyên vật liệu Barcode/FEFO) ngay trên **Dashboard Tổng quan (`overview`)** và trong tab **Quản lý Kho & Tồn kho (`inventory`)**. | ✅ **PASS** |
| `[x]` | **QA-10** | **5. Fix lỗi `Cannot PUT /api/reviews/9/reply`** | Hỗ trợ cả `PUT` & `POST` tại `backend/src/routes/reviewRoutes.js` và khởi động lại server Node mới trên cổng `3000` (thay thế tiến trình cũ PID `25204`). | ✅ **PASS** |
| `[x]` | **QA-11** | **6. Chỉnh lại Front UI/UX trang Khách (`customer/`) cho đẹp và đều** | Đồng bộ chiều cao & ảnh `.feature-card img` ở `customer/css/home.css` & `layout.css`, thêm link **Thực đơn (`menu.html`)** trên Header, hiển thị hạng thẻ cạnh điểm thưởng, và tự động nhận diện SĐT Thành viên/Khách vãng lai ngay trên trang Đặt bàn (`customer/js/booking.js`). | ✅ **PASS** |
| `[x]` | **QA-12** | **7. Rà soát toàn bộ chức năng & Tạo file `.md` ghi nhớ** | Bổ sung cấu hình **Menu ẩn VIP (`isSecretMenu`)** & **Giá vốn (`costPrice`)** vào form Món ăn Admin và lưu toàn bộ lịch sử hệ thống vào `docs/NHAT_KY_HE_THONG_VA_GHI_NHO_SUA_LOI.md`. | ✅ **PASS** |

## Đợt 1 — 5 Hạng mục đã sửa & kiểm thử thành công (5/5 ✅)

| Tick | Mã | Hạng mục / Chức năng | Kết quả |
| :---: | :---: | :--- | :---: |
| `[x]` | **QA-01** | Gộp toàn bộ trang ERP vào trực tiếp Sidebar trang Admin chính (`admin/index.html`) | ✅ **PASS** |
| `[x]` | **QA-02** | Sửa lỗi Lễ tân (Host / Admin / Staff) khi nhấn Check-in bàn cho khách (đã tích chọn bàn) | ✅ **PASS** |
| `[x]` | **QA-03** | Phần Gọi món chọn được Member (tích điểm, giảm giá hạng thẻ) hay Khách vãng lai & áp dụng Voucher | ✅ **PASS** |
| `[x]` | **QA-04** | Thêm chức năng Nhà hàng Reply (Phản hồi) đánh giá của khách hàng | ✅ **PASS** |
| `[x]` | **QA-05** | Chuẩn hóa Front UI/UX đều lại Layout các trang Thực đơn, Đánh giá, Lễ tân | ✅ **PASS** |
