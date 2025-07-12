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

exports.getProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const profile = await authService.getProfile(id, role);

    // Format datetime fields
    if (profile.created_at) {
      profile.created_at = fixDateTimeVN(profile.created_at);
    }
    if (profile.updated_at) {
      profile.updated_at = fixDateTimeVN(profile.updated_at);
    }

    return successResponse(res, "Get user profile successful", profile);
  } catch (err) {
    return errorResponse(res, err.message, 404);
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const profile = await authService.getProfile(id, role);

    // Format datetime fields
    if (profile.created_at) {
      profile.created_at = fixDateTimeVN(profile.created_at);
    }
    if (profile.updated_at) {
      profile.updated_at = fixDateTimeVN(profile.updated_at);
    }

    return successResponse(res, "Get admin profile successful", profile);
  } catch (err) {
    return errorResponse(res, err.message, 404);
  }
};

exports.getShipperProfile = async (req, res) => {
  try {
    const { id, role } = req.user;
    const profile = await authService.getProfile(id, role);

    // Format datetime fields
    if (profile.created_at) {
      profile.created_at = fixDateTimeVN(profile.created_at);
    }
    if (profile.updated_at) {
      profile.updated_at = fixDateTimeVN(profile.updated_at);
    }

    return successResponse(res, "Get shipper profile successful", profile);
  } catch (err) {
    return errorResponse(res, err.message, 404);
  }
};
