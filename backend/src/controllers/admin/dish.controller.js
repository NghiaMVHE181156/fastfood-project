const dishService = require("../../services/dish.service");
const uploadImage = require("../../utils/uploadImage");
const { validationResult } = require("express-validator");

// Chuẩn hóa response
const sendSuccess = (res, message, data) =>
  res.json({ success: true, message, data });
const sendError = (res, message, code, details, status = 400) =>
  res
    .status(status)
    .json({ success: false, message, error: { code, details } });

// Lấy danh sách món ăn (GET /admin/dishes)
exports.getAllDishes = async (req, res) => {
  try {
    const { page, limit, search, category, sort } = req.query;
    const dishes = await dishService.getAllDishes({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      search: search || "",
      category: category ? parseInt(category) : undefined,
      sort: sort || undefined,
    });
    sendSuccess(res, "Fetched all dishes", dishes);
  } catch (err) {
    sendError(res, "Internal Server Error", "INTERNAL_ERROR", err.message, 500);
  }
};

// Tạo món ăn mới (POST /admin/dishes)
exports.createDish = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Xử lý lỗi duplicate name, category not found
    const errArr = errors.array();
    if (errArr.find((e) => e.msg === "DISH_NAME_DUPLICATE")) {
      return sendError(
        res,
        "Dish name already exists",
        "DISH_NAME_DUPLICATE",
        `The name '${req.body.name}' is already in use.`,
        400
      );
    }
    if (errArr.find((e) => e.msg === "CATEGORY_NOT_FOUND")) {
      return sendError(
        res,
        "Category not found",
        "CATEGORY_NOT_FOUND",
        `Category '${req.body.category_id}' does not exist.`,
        422
      );
    }
    return sendError(res, "Validation failed", "VALIDATION_ERROR", errArr, 422);
  }
  try {
    const dish = await dishService.createDish(req.body);
    sendSuccess(res, "Dish created successfully", dish);
  } catch (err) {
    sendError(res, "Server error", "SERVER_ERROR", err.message, 500);
  }
};

// Cập nhật món ăn (PUT /admin/dishes/:id)
exports.updateDish = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errArr = errors.array();
    if (errArr.find((e) => e.msg === "DISH_NAME_DUPLICATE")) {
      return sendError(
        res,
        "Dish name already exists",
        "DISH_NAME_DUPLICATE",
        `The name '${req.body.name}' is already in use.`,
        400
      );
    }
    if (errArr.find((e) => e.msg === "CATEGORY_NOT_FOUND")) {
      return sendError(
        res,
        "Category not found",
        "CATEGORY_NOT_FOUND",
        `Category '${req.body.category_id}' does not exist.`,
        422
      );
    }
    return sendError(res, "Validation failed", "VALIDATION_ERROR", errArr, 422);
  }
  try {
    // Kiểm tra tồn tại
    const oldDish = await dishService.getDishById(req.params.id);
    if (!oldDish) {
      return sendError(
        res,
        "Dish not found",
        "DISH_NOT_FOUND",
        `Dish id '${req.params.id}' does not exist.`,
        404
      );
    }
    const dish = await dishService.updateDish(req.params.id, req.body);
    sendSuccess(res, "Dish updated successfully", dish);
  } catch (err) {
    sendError(res, "Server error", "SERVER_ERROR", err.message, 500);
  }
};

// Xóa món ăn (DELETE /admin/dishes/:id)
exports.deleteDish = async (req, res) => {
  try {
    // Kiểm tra tồn tại
    const oldDish = await dishService.getDishById(req.params.id);
    if (!oldDish) {
      return sendError(
        res,
        "Dish not found",
        "DISH_NOT_FOUND",
        `Dish id '${req.params.id}' does not exist.`,
        404
      );
    }
    await dishService.deleteDish(req.params.id);
    sendSuccess(res, "Dish deleted successfully");
  } catch (err) {
    if (err.code === "DISH_REFERENCED") {
      return sendError(
        res,
        "Dish is referenced in OrderItem",
        "DISH_REFERENCED",
        "Cannot delete dish because it is referenced in OrderItem.",
        409
      );
    }
    sendError(res, "Server error", "SERVER_ERROR", err.message, 500);
  }
};

// Upload ảnh món ăn (POST /admin/dishes/upload)
exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return sendError(
      res,
      "Invalid file",
      "INVALID_FILE",
      "No file uploaded",
      400
    );
  }
  try {
    const url = await uploadImage(req.file.buffer, "fastfood/dishes");
    sendSuccess(res, "Image uploaded", { url });
  } catch (err) {
    sendError(res, "Upload error", "UPLOAD_ERROR", err.message, 500);
  }
};

exports.restoreDish = async (req, res) => {
  try {
    await dishService.restoreDish(req.params.id);
    res.json({ success: true, message: "Dish restored successfully" });
  } catch (err) {
    if (err.code === "DISH_NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Dish not found",
        error: { code: "DISH_NOT_FOUND" },
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error",
      error: { code: "SERVER_ERROR", details: err.message },
    });
  }
};
