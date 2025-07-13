// Controller xử lý logic cho Auth
const authService = require("../services/auth.service");
const { successResponse, errorResponse } = require("../utils/response");
const { signToken } = require("../utils/jwt");
const { fixDateTimeVN } = require("../utils/time");

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return res.json(successResponse("Registration successful", user));
  } catch (err) {
    return res.status(400).json(errorResponse(err.message, "REGISTER_ERROR"));
  }
};

exports.login = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    const user = await authService.login({ user_name, password });
    const token = signToken({ id: user.id, role: user.role });
    return res.json(
      successResponse("Login successful", {
        token,
        role: user.role,
        id: user.id,
      })
    );
  } catch (err) {
    return res.status(401).json(errorResponse(err.message, "LOGIN_ERROR"));
  }
};
