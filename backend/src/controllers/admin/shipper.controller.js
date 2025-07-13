const shipperService = require("../../services/shipper.service");
const { successResponse, errorResponse } = require("../../utils/response");
const { fixDateTimeVN } = require("../../utils/time");

// Lấy tất cả shipper
exports.getAllShippers = async (req, res) => {
  try {
    let shippers = await shipperService.getAllShippers();
    shippers = shippers.map((s) => ({
      ...s,
      created_at: s.created_at ? fixDateTimeVN(s.created_at) : null,
    }));
    return res.json(successResponse("Fetched all shippers", shippers));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Lỗi server", "SERVER_ERROR", error.message));
  }
};

// Tạo mới shipper
exports.createShipper = async (req, res) => {
  try {
    const { user_name, full_name, email, phone, password } = req.body;
    // Check trùng email/phone
    const duplicate = await shipperService.isEmailOrPhoneDuplicate({
      email,
      phone,
    });
    if (duplicate) {
      let code =
        duplicate.email === email
          ? "SHIPPER_EMAIL_DUPLICATE"
          : "SHIPPER_PHONE_DUPLICATE";
      let message =
        duplicate.email === email
          ? "Shipper email already exists"
          : "Shipper phone already exists";
      return res
        .status(400)
        .json(
          errorResponse(
            message,
            code,
            `The ${duplicate.email === email ? "email" : "phone"} '${
              duplicate.email === email ? email : phone
            }' is already in use`
          )
        );
    }
    let shipper = await shipperService.createShipper({
      user_name,
      full_name,
      email,
      phone,
      password,
    });
    if (shipper && shipper.created_at)
      shipper.created_at = fixDateTimeVN(shipper.created_at);
    return res
      .status(201)
      .json(successResponse("Shipper created successfully", shipper));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Lỗi server", "SERVER_ERROR", error.message));
  }
};

// Update profile shipper (không update user_name, password)
exports.updateShipper = async (req, res) => {
  try {
    const shipper_id = parseInt(req.params.id, 10);
    const { full_name, email, phone } = req.body;
    // Kiểm tra tồn tại
    const old = await shipperService.getShipperById(shipper_id);
    if (!old) {
      return res
        .status(404)
        .json(errorResponse("Shipper not found", "SHIPPER_NOT_FOUND"));
    }
    // Check trùng email/phone (trừ chính mình)
    const duplicate = await shipperService.isEmailOrPhoneDuplicate({
      email,
      phone,
      excludeId: shipper_id,
    });
    if (duplicate) {
      let code =
        duplicate.email === email
          ? "SHIPPER_EMAIL_DUPLICATE"
          : "SHIPPER_PHONE_DUPLICATE";
      let message =
        duplicate.email === email
          ? "Shipper email already exists"
          : "Shipper phone already exists";
      return res
        .status(400)
        .json(
          errorResponse(
            message,
            code,
            `The ${duplicate.email === email ? "email" : "phone"} '${
              duplicate.email === email ? email : phone
            }' is already in use`
          )
        );
    }
    let updated = await shipperService.updateShipper({
      shipper_id,
      full_name,
      email,
      phone,
    });
    if (!updated) {
      return res
        .status(404)
        .json(errorResponse("Shipper not found", "SHIPPER_NOT_FOUND"));
    }
    if (updated && updated.created_at)
      updated.created_at = fixDateTimeVN(updated.created_at);
    return res.json(successResponse("Shipper updated successfully", updated));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Lỗi server", "SERVER_ERROR", error.message));
  }
};

// Xóa shipper
exports.deleteShipper = async (req, res) => {
  try {
    const shipper_id = parseInt(req.params.id, 10);
    // Kiểm tra tồn tại
    const old = await shipperService.getShipperById(shipper_id);
    if (!old) {
      return res
        .status(404)
        .json(errorResponse("Shipper not found", "SHIPPER_NOT_FOUND"));
    }
    // Kiểm tra liên kết
    const referenced = await shipperService.isShipperReferenced(shipper_id);
    if (referenced) {
      return res
        .status(409)
        .json(
          errorResponse(
            "Cannot delete shipper",
            "SHIPPER_IN_USE",
            "This shipper is currently assigned to delivery records."
          )
        );
    }
    await shipperService.deleteShipper(shipper_id);
    return res.json(successResponse("Shipper deleted successfully"));
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Lỗi server", "SERVER_ERROR", error.message));
  }
};
