# SCRUM-25 – JWT Testcase Log

## 1. Thông tin

- **Module:** Authentication / JWT
- **Endpoint chính:** `GET /api/users/profile`
- **Collection:** `SCRUM-25 - JWT Testcase_Auto`
- **Số testcase:** 11
- **Công cụ:** Postman
- **Backend:** `http://localhost:3000`

## 2. Danh sách testcase

| ID | Testcase | Expected |
|---|---|---|
| JWT-AUTH-01 | Login với thông tin hợp lệ | HTTP 200, có JWT và thông tin user |
| JWT-AUTH-02 | Login sai password | HTTP 400, `Mật khẩu không chính xác!` |
| JWT-AUTH-03 | Login account không tồn tại | HTTP 404, `Tài khoản không tồn tại!` |
| JWT-AUTH-04 | Login thiếu thông tin | HTTP 400, `Vui lòng nhập đầy đủ thông tin!` |
| JWT-TOKEN-01 | API với JWT hợp lệ | HTTP 200, trả về profile user |
| JWT-TOKEN-02 | API không có JWT | HTTP 401, `No token` |
| JWT-TOKEN-03 | API với JWT giả | HTTP 401, `Invalid token` |
| JWT-TOKEN-04 | API với JWT bị sửa | HTTP 401, `Invalid token` |
| JWT-TOKEN-05 | Authorization sai format | HTTP 401, `Invalid token` |
| JWT-TOKEN-06 | Bearer token rỗng | HTTP 401, `No token` |
| JWT-TOKEN-07 | JWT hết hạn | HTTP 401, `Invalid token` |


### JWT-AUTH-01 → JWT-TOKEN-01

Cơ chế truyền JWT tự động khi chạy Runner:

1. `JWT-AUTH-01` login thành công.
2. Lấy `token` từ response.
3. Lưu token vào collection variale:

```text
jwt_token
```

4. `JWT-TOKEN-01` sử dụng:

```text
{{jwt_token}}
```

Nhờ đó không cần copy JWT thủ công trước mỗi lần chạy test.



## 3. Trạng thái

- [x] Tạo test case JWT
- [x] Kiểm thử login thành công
- [x] Kiểm thử login sai password
- [x] Kiểm thử account không tồn tại
- [x] Kiểm thử thiếu thông tin
- [x] Kiểm thử JWT hợp lệ
- [x] Kiểm thử không có JWT
- [x] Kiểm thử JWT giả
- [x] Kiểm thử JWT bị sửa
- [x] Kiểm thử Authorization sai format
- [x] Kiểm thử Bearer token rỗng
- [x] Kiểm thử JWT hết hạn
- [x] Sửa Assertions TOKEN-06 và TOKEN-07
- [x] Tự động truyền JWT từ AUTH-01 sang TOKEN-01


## 4. Ghi chú

Khi chạy Runner, cần chạy theo thứ tự:

```text
JWT-AUTH-01
→ JWT-AUTH-02
→ JWT-AUTH-03
→ JWT-AUTH-04
→ JWT-TOKEN-01
→ JWT-TOKEN-02
→ JWT-TOKEN-03
→ JWT-TOKEN-04
→ JWT-TOKEN-05
→ JWT-TOKEN-06
→ JWT-TOKEN-07
```

`JWT-AUTH-01` phải chạy trước `JWT-TOKEN-01` để tạo `{{jwt_token}}`.
