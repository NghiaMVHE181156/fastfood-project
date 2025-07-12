// Middleware kiểm tra role
const { errorResponse } = require("../utils/response");

module.exports = (allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return errorResponse(
      res,
      "You are not authorized to access this resource",
      403
    );
  }
  next();
};
