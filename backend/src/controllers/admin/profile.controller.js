const profileService = require("../../services/admin/profile.service");
const { validationResult } = require("express-validator");

exports.getProfile = async (req, res) => {
  try {
    const admin_id = req.user.id;
    const data = await profileService.getProfile(admin_id);
    return res.json({ success: true, message: "Fetched admin profile", data });
  } catch (err) {
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: { code: "INTERNAL_ERROR" },
      });
  }
};

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid input",
        error: { code: "INVALID_INPUT", details: errors.array() },
      });
  }
  try {
    const admin_id = req.user.id;
    const { user_name, email } = req.body;
    const data = await profileService.updateProfile(admin_id, user_name, email);
    return res.json({ success: true, message: "Admin profile updated", data });
  } catch (err) {
    if (err.code === "EMAIL_DUPLICATE") {
      return res
        .status(409)
        .json({
          success: false,
          message: "Email already exists",
          error: { code: "EMAIL_DUPLICATE", details: err.details },
        });
    }
    return res
      .status(500)
      .json({
        success: false,
        message: err.message,
        error: { code: "INTERNAL_ERROR" },
      });
  }
};
