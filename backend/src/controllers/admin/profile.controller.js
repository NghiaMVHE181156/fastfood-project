const profileService = require("../../services/admin/profile.service");
const { validationResult } = require("express-validator");

exports.getProfile = async (req, res) => {
  try {
    const admin_id = req.user.id;
    const data = await profileService.getProfile(admin_id);
    return res.json({ success: true, message: "Fetched admin profile", data });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: { code: "INTERNAL_ERROR" },
    });
  }
};
