const { body, param, query } = require("express-validator");

// Validation cho tạo đơn hàng mới
const createOrderValidation = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array")
    .custom((items) => {
      if (!Array.isArray(items)) {
        throw new Error("Items must be an array");
      }

      for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (!item.dish_id || isNaN(Number(item.dish_id))) {
          throw new Error(`Item ${i + 1}: dish_id must be a valid number`);
        }

        if (
          !item.quantity ||
          isNaN(Number(item.quantity)) ||
          Number(item.quantity) <= 0
        ) {
          throw new Error(`Item ${i + 1}: quantity must be a positive number`);
        }

        if (Number(item.quantity) > 100) {
          throw new Error(`Item ${i + 1}: quantity cannot exceed 100`);
        }
      }

      return true;
    }),

  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Address must be between 10 and 500 characters"),

  body("payment_method")
    .trim()
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["COD", "VNPAY"])
    .withMessage("Payment method must be either 'COD' or 'VNPAY'"),
];

// Validation cho lấy chi tiết đơn hàng
const getOrderDetailValidation = [
  param("id")
    .notEmpty()
    .withMessage("Order ID is required")
    .isInt({ min: 1 })
    .withMessage("Order ID must be a positive integer"),
];

// Validation cho lấy lịch sử đơn hàng (không cần validation đặc biệt)
const getOrderHistoryValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("Limit must be between 1 and 50"),
];

module.exports = {
  createOrderValidation,
  getOrderDetailValidation,
  getOrderHistoryValidation,
};
