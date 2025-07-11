const express = require("express");
const router = express.Router();
const DatabaseController = require("../controllers/databaseController");

// GET /api/database/status - Kiểm tra trạng thái database
router.get("/status", DatabaseController.getDatabaseStatus);

// GET /api/database/tables - Lấy danh sách bảng
router.get("/tables", DatabaseController.getTables);

// GET /api/database/tables/:tableName/columns - Lấy thông tin cột của bảng
router.get("/tables/:tableName/columns", DatabaseController.getTableColumns);

// POST /api/database/query - Thực thi query tùy chỉnh (chỉ cho admin)
router.post("/query", DatabaseController.executeCustomQuery);

module.exports = router;
