# 🍔 FastFood Project

Một ứng dụng web full-stack cho hệ thống quản lý nhà hàng fast food, được xây dựng với React + TypeScript cho frontend và Node.js + Express cho backend.

## 📋 Mô tả

FastFood Project là một ứng dụng web hiện đại được thiết kế để quản lý hoạt động của nhà hàng fast food. Ứng dụng bao gồm:

- **Frontend**: Giao diện người dùng được xây dựng với React 19 và TypeScript
- **Backend**: API server được xây dựng với Node.js và Express
- **Công nghệ hiện đại**: Sử dụng Vite cho development, ESLint cho code quality

## 🚀 Tính năng

- [ ] Quản lý menu và sản phẩm
- [ ] Hệ thống đặt hàng online
- [ ] Quản lý đơn hàng
- [ ] Hệ thống thanh toán
- [ ] Quản lý nhân viên
- [ ] Báo cáo và thống kê
- [ ] Giao diện responsive

## 🛠️ Công nghệ sử dụng

### Frontend

- **React 19** - Thư viện UI
- **TypeScript** - Ngôn ngữ lập trình type-safe
- **Vite** - Build tool và dev server
- **ESLint** - Code linting

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Nodemon** - Development server với auto-reload

## 📦 Cài đặt

### Yêu cầu hệ thống

- Node.js (phiên bản 18 trở lên)
- npm hoặc yarn

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd fastfood-project
```

### Bước 2: Cài đặt dependencies cho Backend

```bash
cd backend
npm install
```

### Bước 3: Cài đặt dependencies cho Frontend

```bash
cd ../frontend
npm install
```

## 🏃‍♂️ Chạy ứng dụng

### Chạy Backend

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại: http://localhost:3000

### Chạy Frontend

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

## 📁 Cấu trúc dự án

```
fastfood-project/
├── backend/                 # Backend API server
│   ├── index.js            # Entry point của server
│   ├── package.json        # Dependencies và scripts
│   └── package-lock.json   # Lock file
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── App.tsx         # Component chính
│   │   ├── App.css         # Styles cho App
│   │   ├── main.tsx        # Entry point
│   │   ├── index.css       # Global styles
│   │   └── assets/         # Static assets
│   ├── public/             # Public assets
│   ├── package.json        # Dependencies và scripts
│   └── vite.config.ts      # Vite configuration
└── README.md               # Tài liệu dự án
```

## 🧪 Scripts có sẵn

### Backend Scripts

- `npm run dev` - Chạy server với nodemon (auto-reload)
- `npm start` - Chạy server production
- `npm test` - Chạy tests (chưa được cấu hình)

### Frontend Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build cho production
- `npm run lint` - Kiểm tra code quality
- `npm run preview` - Preview build production

## 🔧 Cấu hình

### Backend Configuration

- Port mặc định: 3000
- Có thể thay đổi trong file `backend/index.js`

### Frontend Configuration

- Port mặc định: 5173 (Vite)
- Cấu hình trong `frontend/vite.config.ts`

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 📝 License

Dự án này được phân phối dưới giấy phép ISC. Xem file `LICENSE` để biết thêm chi tiết.

## 📞 Liên hệ

- **Tác giả**: [Tên của bạn]
- **Email**: [email@example.com]
- **GitHub**: [github.com/username]

## 🚧 Trạng thái dự án

Dự án hiện đang trong giai đoạn phát triển ban đầu. Các tính năng chính sẽ được triển khai theo thứ tự ưu tiên.

---

⭐ Nếu dự án này hữu ích, hãy cho chúng tôi một star!
