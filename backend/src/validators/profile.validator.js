const { body } = require("express-validator");

const validateAdminProfile = [
  body("user_name").notEmpty().withMessage("user_name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
];

const validateShipperProfile = [
  body("full_name").notEmpty().withMessage("full_name is required"),
  body("phone")
    .notEmpty()
    .withMessage("phone is required")
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/)
    .withMessage("Invalid VN phone number"),
];

const updateProfileValidation = [
  body("full_name").notEmpty().withMessage("full_name is required"),
  body("phone")
    .notEmpty()
    .withMessage("phone is required")
    .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/)
    .withMessage("Invalid VN phone number"),
  body("address")
    .optional()
    .isLength({ max: 255 })
    .withMessage("address must be at most 255 characters"),
];

module.exports = {
  validateAdminProfile,
  validateShipperProfile,
  updateProfileValidation,
};
