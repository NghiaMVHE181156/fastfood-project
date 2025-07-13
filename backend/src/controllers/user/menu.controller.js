const menuService = require("../../services/menu.service");
const { successResponse, errorResponse } = require("../../utils/response");

// Lấy tất cả danh mục món ăn
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await menuService.getAllCategories();
    return res
      .status(200)
      .json(successResponse("Fetched all categories", categories));
  } catch (err) {
    return res
      .status(500)
      .json(
        errorResponse(
          "Internal server error",
          "INTERNAL_SERVER_ERROR",
          err.message
        )
      );
  }
};

// Lấy danh sách món ăn theo category (có phân trang)
exports.getDishesByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    if (category && isNaN(Number(category))) {
      return res
        .status(400)
        .json(errorResponse("Invalid category ID", "INVALID_CATEGORY_PARAM"));
    }
    const result = await menuService.getDishesByCategory({
      category,
      page,
      pageSize,
    });
    return res.status(200).json(successResponse("Fetched dish list", result));
  } catch (err) {
    return res
      .status(500)
      .json(
        errorResponse(
          "Internal server error",
          "INTERNAL_SERVER_ERROR",
          err.message
        )
      );
  }
};

// Lấy chi tiết món ăn
exports.getDishDetail = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
      return res
        .status(400)
        .json(errorResponse("Invalid dish ID", "INVALID_DISH_PARAM"));
    }
    const dish = await menuService.getDishDetail(Number(id));
    if (!dish) {
      return res
        .status(404)
        .json(errorResponse("Dish not found", "DISH_NOT_FOUND"));
    }
    return res.status(200).json(successResponse("Fetched dish details", dish));
  } catch (err) {
    return res
      .status(500)
      .json(
        errorResponse(
          "Internal server error",
          "INTERNAL_SERVER_ERROR",
          err.message
        )
      );
  }
};
