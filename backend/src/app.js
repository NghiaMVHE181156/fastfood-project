const express = require("express");
const app = express();
require("dotenv").config();
const { poolPromise } = require("./config/db");
const cors = require("./middlewares/cors");
const errorHandler = require("./middlewares/errorHandler");
const { successResponse, errorResponse } = require("./utils/response");

// Import swagger docs
require("./docs/swagger")(app);

// Import routes
const authRoutes = require("./routes/auth.route");
const databaseRoutes = require("./routes/databaseRoutes");
const categoryRoutes = require("./routes/admin/category.route");
const dishRoutes = require("./routes/admin/dish.route");
const shipperRoutes = require("./routes/admin/shipper.route");
const adminProfileRoutes = require("./routes/admin/profile.route");
const shipperProfileRoutes = require("./routes/shipper/profile.route");
const profileUploadRoutes = require("./routes/profile.route");

// Import user routes
const menuRoutes = require("./routes/user/menu.route");
const orderRoutes = require("./routes/user/order.route");
const profileRoutes = require("./routes/user/profile.route");

app.use(express.json());
app.use(cors);

// Mount Auth routes
app.use("/auth", authRoutes);
app.use("/admin/categories", categoryRoutes);
app.use("/admin/dishes", dishRoutes);
app.use("/admin/shippers", shipperRoutes);
app.use("/admin", adminProfileRoutes);
app.use("/shipper", shipperProfileRoutes);
app.use("/profile", profileUploadRoutes);

// Mount user routes
app.use("/menu", menuRoutes);
app.use("/orders", orderRoutes);
app.use("/user/profile", profileRoutes);

// Sử dụng routes khác
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

    return res.json(
      successResponse("Backend is healthy", {
        serverTime: formattedTime,
        database: "Connected to SQL Server successfully!",
      })
    );
  } catch (err) {
    return res
      .status(500)
      .json(errorResponse("Failed to connect to SQL Server", "DB_ERROR", err));
  }
});

// Route gốc
app.get("/", (req, res) => {
  return res.json(
    successResponse("FastFood Backend API is running!", {
      endpoints: {
        health: "/api/health",
        swagger: "/api-docs",
      },
    })
  );
});

// Middleware xử lý lỗi (phải đặt cuối cùng)
app.use(errorHandler);

module.exports = app;
