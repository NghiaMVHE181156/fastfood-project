const { getCurrentVietnamTime } = require("./time");

// Utility để format response API chuẩn
class ApiResponse {
  static success(res, data, message = "Success", statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: getCurrentVietnamTime(),
    });
  }

  static error(
    res,
    message = "Error occurred",
    statusCode = 500,
    error = null
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: error?.message || error,
      timestamp: getCurrentVietnamTime(),
    });
  }

  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  static badRequest(res, message = "Bad request") {
    return this.error(res, message, 400);
  }

  static unauthorized(res, message = "Unauthorized") {
    return this.error(res, message, 401);
  }
}

// Chuẩn hóa response cho API
exports.successResponse = (res, message, data = null) => {
  return res.json({ success: true, message, data });
};

exports.errorResponse = (res, message, status = 400, data = null) => {
  return res.status(status).json({ success: false, message, data });
};
