# [UI Review] Staff - Quản lý đơn hàng

| Thông tin       | Chi tiết                         |
| :-------------- | :------------------------------- |
| Module          | Staff - Quản lý đơn hàng         |
| Phạm vi         | Quản lý đơn hàng và thanh toán   |
| Loại Review     | UI/UX Review - Lần 2             |
| Người thực hiện | Nguyễn Phước Thịnh               |
| Ngày review     | 10/08/2026                       |
| Kết quả         | Đạt                              |

---

## 1. Mục tiêu Review

- Kiểm tra bố cục giao diện trang Quản lý đơn hàng.
- Kiểm tra khu vực thống kê và bộ lọc.
- Kiểm tra cách hiển thị Order Card.
- Kiểm tra trạng thái đơn hàng và thanh toán.
- Kiểm tra Responsive trên giao diện Web.
- Ghi nhận defect và đề xuất cải tiến UI/UX.

---

## 2 Kết quả Review

### 2.1. Header và Sidebar

- Sidebar được bố trí rõ ràng và phù hợp với vai trò Staff.
- Chức năng `Quản lý đơn hàng` được Highlight rõ ràng.
- Badge `Live` giúp nhận biết chức năng đang hoạt động.
- Header có Breadcrumb, Search, đồng hồ và Button Làm mới.
- Các thành phần được bố trí cân đối.

| Nội dung        | Kết quả |
| :-------------- | :------ |
| Sidebar         | Đạt     |
| Menu Active     | Đạt     |
| Breadcrumb      | Đạt     |
| Header          | Đạt     |
| Search          | Đạt     |

---

### 2.2. Khu vực thống kê

- Hiển thị 4 Card thống kê:
  - Đơn mới.
  - Bàn đang trống.
  - Bàn đang sử dụng.
  - Đã thanh toán.
- Số liệu được hiển thị rõ ràng.
- Icon và màu sắc giúp phân biệt từng loại thông tin.
- Bố cục Card đồng đều.

| Nội dung         | Kết quả |
| :--------------- | :------ |
| Statistic Card   | Đạt     |
| Icon             | Đạt     |
| Hiển thị số liệu | Đạt     |
| Màu sắc          | Đạt     |
| Bố cục           | Đạt     |

---

### 2.3. Bộ lọc đơn hàng

- Các trạng thái được phân chia rõ ràng:
  - Tất cả.
  - Chờ xác nhận.
  - Đang bếp làm.
  - Cần thanh toán.
  - Đã hoàn tất.
- Trạng thái đang chọn được Highlight bằng màu xanh.
- Icon và số lượng giúp nhận biết trạng thái nhanh.

| Nội dung     | Kết quả |
| :----------- | :------ |
| Filter       | Đạt     |
| Active State | Đạt     |
| Icon         | Đạt     |
| Trạng thái   | Đạt     |

---

### 2.4 Order Card

- Thông tin mã đơn, bàn, khách hàng và danh sách món được hiển thị đầy đủ.
- Tổng tiền và trạng thái thanh toán được làm nổi bật.
- Các thông tin chính có thể nhận biết nhanh.

Tuy nhiên, phần trạng thái đơn hàng `Đã xác nhận` đang hiển thị chưa cân đối.

| Nội dung                  | Kết quả       |
| :------------------------ | :------------ |
| Mã đơn                    | Đạt           |
| Thông tin bàn/khách hàng  | Đạt           |
| Danh sách món              | Đạt           |
| Tổng tiền                 | Đạt           |
| Trạng thái thanh toán     | Đạt           |
| Trạng thái đơn hàng       | **Cần cải thiện** |

---

### Trạng thái đơn hàng

- Badge `Đã xác nhận` có kích thước chưa phù hợp với nội dung.
- Chữ bị xuống dòng và lệch xuống phía dưới.
- Khoảng cách giữa Icon và nội dung chưa cân đối.
- Badge chiếm nhiều diện tích nhưng thông tin hiển thị chưa gọn.
- Tổng thể phần Header của Order Card bị mất cân đối và gây rối mắt.

**Yêu cầu cải thiện:**

- Thiết kế lại Badge trạng thái để vừa vặn với nội dung.
- Căn giữa Icon và chữ theo chiều ngang và chiều dọc.
- Hạn chế xuống dòng đối với các trạng thái ngắn như `Đã xác nhận`.
- Điều chỉnh padding, font-size và chiều rộng Badge.
- Đảm bảo trạng thái nằm cân đối với mã đơn hàng.

---
### 2.5. Màu sắc và Component

- Nền sáng kết hợp Sidebar tối tạo sự phân biệt rõ ràng.
- Màu xanh được sử dụng làm màu chủ đạo.
- Xanh lá, vàng và đỏ được sử dụng để thể hiện trạng thái.
- Button, Card và Badge có thiết kế thống nhất.
- Icon hỗ trợ tốt cho việc nhận biết chức năng.

| Nội dung       | Kết quả |
| :------------- | :------ |
| Màu nền        | Đạt     |
| Màu chủ đạo    | Đạt     |
| Button         | Đạt     |
| Icon           | Đạt     |
| Badge          | Đạt     |
| Tính nhất quán | Đạt     |

---

## 3. Đánh giá UX/UI

### 3.1. Bố cục

- Layout rõ ràng giữa Sidebar, Header, thống kê, Filter và Order Card.
- Thông tin quan trọng được đặt ở vị trí dễ quan sát.
- Order Card được bố trí hợp lý và dễ theo dõi.

| Nội dung       | Kết quả |
| :------------- | :------ |
| Layout         | Đạt     |
| Navigation     | Đạt     |
| Statistic Card | Đạt     |
| Filter         | Đạt     |
| Order Card     | Đạt     |

### 3.2. Trải nghiệm sử dụng

- Staff có thể nhanh chóng theo dõi số lượng đơn hàng.
- Trạng thái đơn hàng và thanh toán dễ nhận biết.
- Bộ lọc hỗ trợ tìm nhanh nhóm đơn cần xử lý.
- Thông tin món và tổng tiền được trình bày rõ ràng.

| Nội dung             | Kết quả |
| :------------------- | :------ |
| Theo dõi đơn hàng    | Đạt     |
| Theo dõi trạng thái  | Đạt     |
| Theo dõi thanh toán  | Đạt     |
| Khả năng quan sát    | Đạt     |

---

## 4. Responsive

- Trên giao diện Web, Order Card vẫn giữ được bố cục chính.
- Tuy nhiên Badge trạng thái cần được thiết kế linh hoạt để tránh xuống dòng hoặc lệch vị trí khi kích thước khu vực thay đổi.

| Nội dung          | Kết quả       |
| :---------------- | :------------ |
| Order Card        | Đạt           |
| Header Card       | Cần cải thiện |
| Badge trạng thái  | Cần cải thiện |
| Responsive Web    | Cần cải thiện |

---

## 5. Danh sách Defect

| Defect ID      | Nội dung                                             | Mức độ     | Độ ưu tiên | Trạng thái |
| :------------- | :--------------------------------------------------- | :--------- | :--------- | :--------- |
| DEF-UI-STAFF-001 | Badge `Đã xác nhận` bị lệch và xuống dòng, bố cục rối mắt | Trung bình | Cao | Cần sửa |

### DEF-UI-STAFF-001 - Badge trạng thái hiển thị chưa phù hợp

| Thông tin        | Chi tiết |
| :--------------- | :------- |
| Kết quả mong đợi | Badge trạng thái vừa vặn với nội dung, Icon và chữ được căn giữa, không xuống dòng. |
| Kết quả thực tế  | Chữ `Đã xác nhận` bị xuống dòng và lệch xuống, Badge có kích thước chưa phù hợp. |
| Mức độ           | Trung bình |
| Độ ưu tiên       | Cao |
| Ảnh hưởng        | Làm Order Card mất cân đối, gây rối mắt và giảm tính chuyên nghiệp của giao diện. |
| Đề xuất          | Thiết kế lại Badge, điều chỉnh kích thước, padding, font-size và căn giữa nội dung. |

---

## 6. Đề xuất cải tiến UI/UX

- Làm lại khu vực Badge trạng thái theo hướng **gọn, vừa nội dung**.
- Giữ trạng thái `Đã xác nhận` trên một dòng.
- Căn giữa Icon và chữ theo cả chiều ngang và chiều dọc.
- Giảm padding và kích thước Badge để không chiếm quá nhiều diện tích.
- Thống nhất kích thước Badge cho các trạng thái `Chờ xác nhận`, `Đã xác nhận`, `Đã hoàn tất`.
- Ưu tiên bố cục đơn giản, tránh tập trung quá nhiều thành phần trong Header Card.

---

## 7. Kết luận

- Order Card đã đầy đủ thông tin cần thiết và đáp ứng được chức năng quản lý đơn hàng.
- Tuy nhiên khu vực trạng thái `Đã xác nhận` đang có lỗi căn chỉnh rõ ràng.
- Chữ bị xuống dòng, lệch vị trí và Badge có kích thước chưa phù hợp khiến giao diện khá rối mắt.
- Cần **thiết kế lại Badge trạng thái cho vừa vặn với nội dung, căn chỉnh đồng nhất và giảm mật độ thông tin**.
- Đây là lỗi UI cần ưu tiên chỉnh sửa trong lần Review thứ 2.

| Nội dung       | Kết quả           |
| :------------- | :---------------- |
| Layout         | Cần cải thiện     |
| Order Card     | Đạt               |
| Trạng thái     | **Không đạt**     |
| Căn chỉnh      | **Không đạt**     |
| Responsive Web | Cần cải thiện     |
| Defect         | **1 lỗi**         |
| Kết quả Review | **Cần cải thiện** |