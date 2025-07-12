const categoryService = require("../../services/category.service");
const { successResponse, errorResponse } = require("../../utils/response");

// Lấy tất cả category (có hỗ trợ phân trang, tìm kiếm, sắp xếp)
exports.getAllCategories = async (req, res) => {
  try {
    const { page, limit, search, sort } = req.query;
    const result = await categoryService.getAllCategories({
      page,
      limit,
      search,
      sort,
    });
    return res.json(successResponse("Fetched all categories", result));
  } catch (err) {
    return res
      .status(500)
      .json(
        errorResponse(
          "Internal Server Error",
          "INTERNAL_SERVER_ERROR",
          err.message
        )
      );
  }
};

// Tạo mới category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const created = await categoryService.createCategory({ name, description });
    return res.json(successResponse("Category created successfully", created));
  } catch (err) {
    if (err.code === "DUPLICATE_NAME") {
      return res
        .status(400)
        .json(errorResponse("Duplicate Name", "DUPLICATE_NAME", err.message));
    }
    if (err.code === "VALIDATION_FAILED") {
      return res
        .status(422)
        .json(
          errorResponse("Validation Failed", "VALIDATION_FAILED", err.message)
        );
    }
    return res
      .status(500)
      .json(errorResponse("Server Error", "SERVER_ERROR", err.message));
  }
};

// Cập nhật category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const updated = await categoryService.updateCategory(id, {
      name,
      description,
    });
    return res.json(successResponse("Category updated successfully", updated));
  } catch (err) {
    if (err.code === "NOT_FOUND") {
      return res
        .status(404)
        .json(errorResponse("Not Found", "NOT_FOUND", err.message));
    }
    if (err.code === "DUPLICATE_NAME") {
      return res
        .status(400)
        .json(errorResponse("Duplicate Name", "DUPLICATE_NAME", err.message));
    }
    if (err.code === "VALIDATION_FAILED") {
      return res
        .status(422)
        .json(
          errorResponse("Validation Failed", "VALIDATION_FAILED", err.message)
        );
    }
    return res
      .status(500)
      .json(errorResponse("Server Error", "SERVER_ERROR", err.message));
  }
};

// Xóa category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryService.deleteCategory(id);
    return res.json(successResponse("Category deleted successfully"));
  } catch (err) {
    if (err.code === "NOT_FOUND") {
      return res
        .status(404)
        .json(errorResponse("Not Found", "NOT_FOUND", err.message));
    }
    if (err.code === "CATEGORY_IN_USE") {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete category because it is being used by another dish",
        error: {
          code: "CATEGORY_IN_USE",
          details: "Dish table references this category",
        },
      });
    }
    return res
      .status(500)
      .json(errorResponse("Server Error", "SERVER_ERROR", err.message));
  }
};
