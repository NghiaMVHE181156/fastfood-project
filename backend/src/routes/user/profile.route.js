const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewares/auth.middleware");
const {
  updateProfileValidation,
} = require("../../validators/profile.validator");
const { validationResult } = require("express-validator");
const profileController = require("../../controllers/user/profile.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     UserProfile:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: User ID
 *         user_name:
 *           type: string
 *           description: Username
 *         email:
 *           type: string
 *           format: email
 *           description: Email
 *         full_name:
 *           type: string
 *           description: Full name
 *         phone:
 *           type: string
 *           description: Phone number
 *         address:
 *           type: string
 *           nullable: true
 *           description: Address
 *         avatar_url:
 *           type: string
 *           nullable: true
 *           description: Avatar URL
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           nullable: true
 *           description: Gender
 *         birthdate:
 *           type: string
 *           format: date
 *           nullable: true
 *           description: Birthdate
 *         status:
 *           type: string
 *           enum: [active, inactive, banned]
 *           description: Account status
 *         is_flagged:
 *           type: boolean
 *           description: Is flagged
 *         boom_count:
 *           type: integer
 *           description: Boom count
 *         note:
 *           type: string
 *           nullable: true
 *           description: Note
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Created at
 *     UpdateProfileRequest:
 *       type: object
 *       required:
 *         - full_name
 *         - phone
 *       properties:
 *         full_name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           description: Full name
 *         phone:
 *           type: string
 *           pattern: '^[0-9]{10,11}$'
 *           description: Phone number (10-11 digits)
 *         email:
 *           type: string
 *           format: email
 *           description: Email (optional)
 *         address:
 *           type: string
 *           maxLength: 255
 *           description: Address (optional)
 *         avatar_url:
 *           type: string
 *           description: Avatar URL (optional)
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: Gender (optional)
 *         birthdate:
 *           type: string
 *           format: date
 *           description: Birthdate (optional)
 */

// Middleware xử lý validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: {
        code: "VALIDATION_ERROR",
        details: errors.array(),
      },
    });
  }
  next();
};

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Lấy thông tin profile của user đang đăng nhập
 *     tags: [User - Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin profile thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Fetched user profile"
 *                 data:
 *                   $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Missing authentication token"
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "UNAUTHORIZED"
 *       500:
 *         description: Lỗi server
 */
// GET /user/profile - Lấy thông tin profile của user đang đăng nhập
router.get("/", authMiddleware, profileController.getProfile);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Cập nhật thông tin profile của user đang đăng nhập
 *     tags: [User - Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           example:
 *             email: "nguyenvana@example.com"
 *             full_name: "Nguyễn Văn B"
 *             phone: "0909000111"
 *             address: "456 Nguyễn Huệ"
 *             avatar_url: "https://example.com/avatar.jpg"
 *             gender: "male"
 *             birthdate: "1990-01-01"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thông tin thành công"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     full_name:
 *                       type: string
 *                       example: "Nguyễn Văn B"
 *                     phone:
 *                       type: string
 *                       example: "0909000111"
 *                     address:
 *                       type: string
 *                       example: "456 Nguyễn Huệ"
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation failed"
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "VALIDATION_ERROR"
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       409:
 *         description: Số điện thoại đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Phone number already exists"
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: "PHONE_EXISTS"
 *       500:
 *         description: Lỗi server
 */
// PUT /user/profile - Cập nhật thông tin profile của user đang đăng nhập
router.put(
  "/",
  authMiddleware,
  updateProfileValidation,
  handleValidationErrors,
  profileController.updateProfile
);

module.exports = router;
