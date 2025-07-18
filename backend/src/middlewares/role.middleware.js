// Middleware kiểm tra role
const { errorResponse } = require("../utils/response");

module.exports = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: "You are not authorized to access this resource",
      error: { code: "FORBIDDEN" },
    });
  }
  next();
};
