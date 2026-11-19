# 📋 BẢNG THEO DÕI & NGHIỆM THU SỬA LỖI (QA TEST TRACKER)

> Chi tiết kỹ thuật về nguyên nhân và giải pháp sửa lỗi được lưu tại [NHAT_KY_HE_THONG_VA_GHI_NHO_SUA_LOI.md](file:///c:/Users/Admin/Desktop/HKDN/HKDN2026/docs/NHAT_KY_HE_THONG_VA_GHI_NHO_SUA_LOI.md).

## Đợt 3 — 4 Hạng mục đã sửa & kiểm thử thành công (4/4 ✅)

| Tick | Mã | Hạng mục / Chức năng | Giải pháp đã thực hiện | Kết quả |
| :---: | :---: | :--- | :--- | :---: |
| `[x]` | **QA-13** | **1. Trang Khách khu Thực đơn: Chỉ mở Voucher có sẵn khi đơn đạt yêu cầu, KHÔNG cho khách tự gán Thành viên VIP** | Gỡ bỏ ô tự tìm/chọn nhanh tài khoản VIP người khác khỏi giỏ hàng trang Khách (`customer/js/menu.js`); tự động kiểm tra tổng tiền đơn hàng với `minOrderValue` để mở khóa hoặc khóa (`🔒 thiếu ...đ`) từng Voucher có sẵn. | ✅ **PASS** |
| `[x]` | **QA-14** | **2. Ở Kho Barcode thêm phần trượt Slide để xem Định lượng Công thức Món ăn** | Chuyển 2 bảng Kho Barcode (FEFO) và Định lượng Công thức (Recipe) trong `admin/app.js` thành Slider trượt ngang (`#inventoryHorizontalSlider`) kèm 2 nút bấm chuyển nhanh **⬅️ Slide 1** và **Slide 2 ➡️** mà không cần zoom trình duyệt. | ✅ **PASS** |
| `[x]` | **QA-15** | **3. Quản lý bàn gọi món: Chống chồng đơn & Search gần đúng Tên/SĐT cập nhật các trường xung quanh** | Tự động gộp món và cập nhật thông tin Khách hàng (Vãng lai <-> Thành viên VIP) vào đơn đang mở của bàn tại `orderController.js` (không tạo đơn chồng); hiển thị danh sách gợi ý nổi `#posMemberSuggestList` khi gõ gần đúng Tên/SĐT và tự động điền toàn bộ các trường xung quanh khi click chọn. | ✅ **PASS** |
| `[x]` | **QA-16** | **4. Gộp Kitchen vào Dashboard Admin & Báo hủy món khách đột xuất ngay tại khu vực chế biến** | Tích hợp mục **🔥 Bếp KDS & Chế biến (`kitchen`)** vào Sidebar trang Admin chính (`admin/app.js`), thêm API `PUT /api/orders/:id/items/:itemId/cancel` và nút **"🚫 Hủy món"** trên từng món ăn để Bếp báo hủy món đột xuất, tự động khóa món trên Menu, ghi Log ca thu ngân và tính lại tiền đơn. | ✅ **PASS** |

## Đợt 2 — 7 Hạng mục đã sửa & kiểm thử thành công (7/7 ✅)

| Tick | Mã | Hạng mục / Chức năng | Kết quả |
| :---: | :---: | :--- | :---: |
| `[x]` | **QA-06** | Search khách hàng thành viên tích điểm & sửa lỗi mất focus con trỏ | ✅ **PASS** |
| `[x]` | **QA-07** | Thêm Log vào Ca thu ngân & Hủy đơn (`Shift.note` & Bảng Nhật ký Ca / Void Logs) | ✅ **PASS** |
| `[x]` | **QA-08** | Quản lý bàn đồng bộ đặt bàn (Thành viên vs Khách vãng lai theo SĐT) | ✅ **PASS** |
| `[x]` | **QA-09** | Quản lý kho & Xem số lượng tồn kho ngay trong Dashboard Admin (`overview` & `inventory`) | ✅ **PASS** |
| `[x]` | **QA-10** | Fix lỗi `Cannot PUT /api/reviews/9/reply` khi phản hồi đánh giá | ✅ **PASS** |
| `[x]` | **QA-11** | Chỉnh lại Front UI/UX trang Khách (`customer/`) cho đẹp và đều | ✅ **PASS** |
| `[x]` | **QA-12** | Rà soát toàn bộ chức năng & Tạo file `.md` ghi nhớ hệ thống | ✅ **PASS** |

## Đợt 1 — 5 Hạng mục đã sửa & kiểm thử thành công (5/5 ✅)

| Tick | Mã | Hạng mục / Chức năng | Kết quả |
| :---: | :---: | :--- | :---: |
| `[x]` | **QA-01** | Gộp toàn bộ trang ERP vào trực tiếp Sidebar trang Admin chính (`admin/index.html`) | ✅ **PASS** |
| `[x]` | **QA-02** | Sửa lỗi Lễ tân (Host / Admin / Staff) khi nhấn Check-in bàn cho khách (đã tích chọn bàn) | ✅ **PASS** |
| `[x]` | **QA-03** | Phần Gọi món chọn được Member (tích điểm, giảm giá hạng thẻ) hay Khách vãng lai & áp dụng Voucher | ✅ **PASS** |
| `[x]` | **QA-04** | Thêm chức năng Nhà hàng Reply (Phản hồi) đánh giá của khách hàng | ✅ **PASS** |
| `[x]` | **QA-05** | Chuẩn hóa Front UI/UX đều lại Layout các trang Thực đơn, Đánh giá, Lễ tân | ✅ **PASS** |
