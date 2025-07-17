// Middleware xác thực JWT
const { verifyToken } = require("../utils/jwt");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Missing authentication token",
      error: { code: "UNAUTHORIZED" },
    });
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: { code: "UNAUTHORIZED" },
    });
  }
  req.user = { id: decoded.id, role: decoded.role };
  next();
};

// Middleware phân quyền role
const requireRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: { code: "UNAUTHORIZED" },
      });
    }
    // Cho phép truyền vào 1 role (string) hoặc nhiều role (array)
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied - one of [${requiredRole.join(
            ", "
          )}] role required`,
          error: { code: "FORBIDDEN" },
        });
      }
    } else {
      if (req.user.role !== requiredRole) {
        return res.status(403).json({
          success: false,
          message: `Access denied - ${requiredRole} role required`,
          error: { code: "FORBIDDEN" },
        });
      }
    }
    next();
  };
};

module.exports = {
  authMiddleware,
  requireRole,
};
