// Middleware xác thực JWT
const { verifyToken } = require("../utils/jwt");
const { errorResponse } = require("../utils/response");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse(res, "Missing authentication token", 401);
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return errorResponse(res, "Invalid or expired token", 401);
  }
  req.user = { id: decoded.id, role: decoded.role };
  next();
};

// Middleware phân quyền role
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, "Authentication required", 401);
    }

    if (req.user.role !== requiredRole) {
      return errorResponse(
        res,
        `Access denied - ${requiredRole} role required`,
        403
      );
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  requireRole,
};
