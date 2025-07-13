const profileService = require("../../services/shipper/profile.service");
const { validationResult } = require("express-validator");
const { fixDateTimeVN } = require("../../utils/time");

exports.getProfile = async (req, res) => {
  try {
    const shipper_id = req.user.id;
    const data = await profileService.getProfile(shipper_id);
    if (data.created_at) data.created_at = fixDateTimeVN(data.created_at);
    return res.json({
      success: true,
      message: "Fetched shipper profile",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: { code: "INTERNAL_ERROR" },
    });
  }
};

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      error: { code: "INVALID_INPUT", details: errors.array() },
    });
  }
  try {
    const shipper_id = req.user.id;
    const { full_name, phone } = req.body;
    const data = await profileService.updateProfile(
      shipper_id,
      full_name,
      phone
    );
    return res.json({
      success: true,
      message: "Shipper profile updated",
      data,
    });
  } catch (err) {
    if (err.code === "PHONE_DUPLICATE") {
      return res.status(409).json({
        success: false,
        message: "Phone number already exists",
        error: { code: "PHONE_DUPLICATE", details: err.details },
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message,
      error: { code: "INTERNAL_ERROR" },
    });
  }
};
