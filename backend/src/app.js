const express = require("express");
const app = express();
require("dotenv").config();
const { poolPromise } = require("./config/db");
const cors = require("./middlewares/cors");
const errorHandler = require("./middlewares/errorHandler");
const ApiResponse = require("./utils/response");

// Import routes
const databaseRoutes = require("./routes/databaseRoutes");

app.use(express.json());
app.use(cors);

// Sử dụng routes
app.use("/api/database", databaseRoutes);

const { toVietnamTimeString } = require("./utils/time");

// Test route để kiểm tra kết nối SQL Server
app.get("/api/health", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .query("SELECT GETDATE() as server_time");

    const rawTime = result.recordset[0].server_time;
    const formattedTime = toVietnamTimeString(rawTime);

    ApiResponse.success(
      res,
      {
        serverTime: formattedTime,
        database: "Connected to SQL Server successfully!",
      },
      "Backend is healthy"
    );
  } catch (err) {
    ApiResponse.error(res, "Failed to connect to SQL Server", 500, err);
  }
});

// Route gốc
app.get("/", (req, res) => {
  ApiResponse.success(res, {
    message: "FastFood Backend API is running!",
    endpoints: {
      health: "/api/health",
    },
  });
});

// Middleware xử lý lỗi (phải đặt cuối cùng)
app.use(errorHandler);

module.exports = app;
