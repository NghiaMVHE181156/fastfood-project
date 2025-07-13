// Controller xử lý logic cho Profile
const profileService = require("../../services/profile.service");
const { successResponse, errorResponse } = require("../../utils/response");
const { fixDateTimeVN } = require("../../utils/time");

// Lấy thông tin profile của user đang đăng nhập
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.user; // Lấy user_id từ JWT token
    const profile = await profileService.getUserProfile(id);
    // Format các trường datetime lấy từ DB
    if (profile.created_at)
      profile.created_at = fixDateTimeVN(profile.created_at);
    if (profile.birthdate)
      profile.birthdate = fixDateTimeVN(profile.birthdate).slice(0, 10); // chỉ lấy YYYY-MM-DD
    return res.json(
      successResponse("Fetched user profile successfully", profile)
    );
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json(errorResponse(err.message, "USER_NOT_FOUND"));
    }
    return res.status(500).json(errorResponse(err.message, "INTERNAL_ERROR"));
  }
};

// Cập nhật thông tin profile của user đang đăng nhập
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user; // Lấy user_id từ JWT token
    const updateData = req.body;

    // Chỉ cho phép cập nhật các field được phép
    const allowedFields = [
      "full_name",
      "phone",
      "address",
      "avatar_url",
      "gender",
      "birthdate",
      "email",
    ];
    const filteredData = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    }

    const updatedProfile = await profileService.updateUserProfile(
      id,
      filteredData
    );

    if (updatedProfile.created_at)
      updatedProfile.created_at = fixDateTimeVN(updatedProfile.created_at);
    if (updatedProfile.birthdate)
      updatedProfile.birthdate = fixDateTimeVN(updatedProfile.birthdate).slice(
        0,
        10
      );
    return res.json(
      successResponse("Profile updated successfully", updatedProfile)
    );
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json(errorResponse(err.message, "USER_NOT_FOUND"));
    }
    if (err.message === "Phone number already exists") {
      return res.status(409).json(errorResponse(err.message, "PHONE_EXISTS"));
    }
    return res.status(500).json(errorResponse(err.message, "INTERNAL_ERROR"));
  }
};
