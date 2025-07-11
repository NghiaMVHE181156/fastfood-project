# FastFood Backend API

Backend Node.js với Express và SQL Server cho hệ thống bán đồ ăn trực tuyến.

## 🚀 Cài đặt và Chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` trong thư mục backend:

```env
PORT=8080

DB_USER=sa
DB_PASSWORD=yourStrong(!)Password
DB_SERVER=localhost
DB_DATABASE=Fast_Food_db
DB_PORT=1433
```

### 3. Chạy server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📋 API Endpoints

### Health Check

- `GET /api/health` - Kiểm tra trạng thái server và kết nối database

### Database Management

- `GET /api/database/status` - Kiểm tra trạng thái database
- `GET /api/database/tables` - Lấy danh sách bảng
- `GET /api/database/tables/:tableName/columns` - Lấy thông tin cột của bảng
- `POST /api/database/query` - Thực thi query tùy chỉnh

### Root

- `GET /` - Thông tin API

## 🏗️ Cấu trúc Project

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Cấu hình kết nối SQL Server
│   ├── routes/
│   │   ├── databaseRoutes.js  # Routes cho database
│   │   └── index.js           # Index routes
│   ├── controllers/
│   │   └── databaseController.js # Controllers
│   ├── services/
│   │   └── databaseService.js # Services tương tác DB
│   ├── middlewares/
│   │   ├── cors.js            # CORS middleware
│   │   └── errorHandler.js    # Error handling
│   ├── utils/
│   │   ├── response.js        # Response format utility
│   │   ├── time.js            # Time utilities (UTC+7)
│   │   └── time.test.js       # Test time utilities
│   └── app.js                 # App Express chính
├── .env                       # Biến môi trường
├── index.js                   # Entry point
└── package.json
```

## 🔧 Tính năng

- ✅ Kết nối SQL Server với connection pool
- ✅ CORS middleware cho frontend
- ✅ Error handling global
- ✅ Response format chuẩn với múi giờ Việt Nam (UTC+7)
- ✅ Database service layer
- ✅ Health check endpoint
- ✅ Database management endpoints
- ✅ Time utilities cho múi giờ Việt Nam

## 🛠️ Công nghệ sử dụng

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **mssql** - SQL Server driver
- **dotenv** - Environment variables
- **nodemon** - Development server

## 📝 Ghi chú

- Đảm bảo SQL Server đã được cài đặt và chạy
- Bật TCP/IP và SQL Authentication trong SQL Server Configuration Manager
- Database `Fast_Food_db` phải tồn tại trước khi chạy
