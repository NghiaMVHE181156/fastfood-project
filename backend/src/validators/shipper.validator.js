const { body } = require("express-validator");

// Regex cho user_name: phải bắt đầu bằng shipper_
const USERNAME_REGEX = /^shipper_\w+$/;

// Validator cho tạo mới shipper
const createShipperValidator = [
  body("user_name")
    .exists({ checkFalsy: true })
    .withMessage("user_name is required")
    .bail()
    .isString()
    .withMessage("user_name must be a string")
    .bail()
    .matches(USERNAME_REGEX)
    .withMessage("user_name must start with shipper_"),
  body("full_name")
    .exists({ checkFalsy: true })
    .withMessage("full_name is required")
    .bail()
    .isString()
    .withMessage("full_name must be a string"),
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("email must be a valid email address"),
  body("phone")
    .exists({ checkFalsy: true })
    .withMessage("phone is required")
    .bail()
    .isString()
    .withMessage("phone must be a string"),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("password is required")
    .bail()
    .isString()
    .withMessage("password must be a string"),
];

// Validator cho update shipper (chỉ cho phép update profile, không cho update user_name, password)
const updateShipperValidator = [
  body("full_name")
    .optional()
    .isString()
    .withMessage("full_name must be a string"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("email must be a valid email address"),
  body("phone").optional().isString().withMessage("phone must be a string"),
];

module.exports = {
  createShipperValidator,
  updateShipperValidator,
};
