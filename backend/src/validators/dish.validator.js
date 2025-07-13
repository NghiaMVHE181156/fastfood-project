const { body, param } = require("express-validator");
const dishService = require("../services/dish.service");
const categoryService = require("../services/category.service");

// Kiểm tra name unique (dùng trong create)
const checkNameUnique = async (name) => {
  const exists = await dishService.isNameExists(name);
  if (exists) {
    throw new Error("DISH_NAME_DUPLICATE");
  }
  return true;
};

// Kiểm tra category_id tồn tại
const checkCategoryExists = async (category_id) => {
  const exists = await categoryService.isCategoryExists(category_id);
  if (!exists) {
    throw new Error("CATEGORY_NOT_FOUND");
  }
  return true;
};

const validateDish = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .custom(checkNameUnique),
  body("description").optional().isString(),
  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .bail()
    .isInt({ gt: 0 })
    .withMessage("Price must be a positive integer"),
  body("image_url").optional().isString(),
  body("category_id")
    .notEmpty()
    .withMessage("Category is required")
    .bail()
    .isInt({ gt: 0 })
    .bail()
    .custom(checkCategoryExists),
  body("is_available").optional().isBoolean(),
];

const validateDishUpdate = [
  param("id").isInt({ gt: 0 }),
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .bail()
    .custom(async (name, { req }) => {
      // Nếu name thay đổi, kiểm tra unique (trừ chính nó)
      const exists = await dishService.isNameExists(name, req.params.id);
      if (exists) throw new Error("DISH_NAME_DUPLICATE");
      return true;
    }),
  body("description").optional().isString(),
  body("price").optional().isInt({ gt: 0 }),
  body("image_url").optional().isString(),
  body("category_id")
    .optional()
    .isInt({ gt: 0 })
    .bail()
    .custom(checkCategoryExists),
  body("is_available").optional().isBoolean(),
];

const validateUploadImage = [
  // Sử dụng multer kiểm tra file ở middleware upload
];

module.exports = {
  validateDish,
  validateDishUpdate,
  validateUploadImage,
};
