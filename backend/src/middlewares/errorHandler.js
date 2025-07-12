const ApiResponse = require("../utils/response");

// Middleware xử lý lỗi global
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Lỗi SQL Server
  if (err.code === "ELOGIN" || err.code === "EALREADYCONNECTED") {
    return ApiResponse.error(res, "Database connection error", 500, err);
  }

  // Lỗi validation
  if (err.name === "ValidationError") {
    return ApiResponse.badRequest(res, "Validation error", err);
  }

  // Lỗi mặc định
  return ApiResponse.error(res, "Internal server error", 500, err);
};

module.exports = errorHandler;
