# Test Auth Module

Thư mục này chứa các test case cho các chức năng xác thực (Auth) của hệ thống FastFood API.

## Các chức năng kiểm thử:

- Đăng ký người dùng (POST /auth/register)
- Đăng nhập (POST /auth/login)
- Lấy thông tin profile (GET /user/profile)
- Middleware xác thực JWT
- Middleware phân quyền role

## Hướng dẫn chạy test

- Sử dụng lệnh: `npm test` hoặc `jest`
- Đảm bảo đã cấu hình biến môi trường, DB, JWT_SECRET trước khi test

## Lưu ý

- Các test sẽ kiểm tra cả trường hợp thành công và thất bại (thiếu trường, sai mật khẩu, token không hợp lệ, v.v.)
