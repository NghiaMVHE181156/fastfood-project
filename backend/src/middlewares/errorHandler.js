const { errorResponse } = require("../utils/response");

// Middleware xử lý lỗi global
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Lỗi SQL Server
  if (err.code === "ELOGIN" || err.code === "EALREADYCONNECTED") {
    return res
      .status(500)
      .json(errorResponse("Database connection error", "DB_ERROR", err));
  }

  // Lỗi validation
  if (err.name === "ValidationError") {
    return res
      .status(400)
      .json(errorResponse("Validation error", "VALIDATION_ERROR", err));
  }

  // Lỗi mặc định
  return res
    .status(500)
    .json(errorResponse("Internal server error", "INTERNAL_SERVER_ERROR", err));
};

module.exports = errorHandler;
