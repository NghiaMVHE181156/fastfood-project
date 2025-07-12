const { body } = require("express-validator");

const validateCategory = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be 1-100 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  (req, res, next) => {
    const { validationResult } = require("express-validator");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation Failed",
        error: {
          code: "VALIDATION_FAILED",
          details: errors.array(),
        },
      });
    }
    next();
  },
];

const validateCategoryUpdate = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 1, max: 100 })
    .withMessage("Name must be 1-100 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  (req, res, next) => {
    const { validationResult } = require("express-validator");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation Failed",
        error: {
          code: "VALIDATION_FAILED",
          details: errors.array(),
        },
      });
    }
    next();
  },
];

module.exports = {
  validateCategory,
  validateCategoryUpdate,
};
