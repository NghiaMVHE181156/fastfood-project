// File này sẽ khai báo các route liên quan đến Auth (đăng ký, đăng nhập, lấy profile)

const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const {
  authMiddleware,
  requireRole,
} = require("../middlewares/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Các API xác thực người dùng
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - email
 *               - full_name
 *               - phone
 *               - password
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: user123
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               full_name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               phone:
 *                 type: string
 *                 example: 0909123456
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     user_name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Lỗi đầu vào hoặc trùng email/phone/user_name
 */
router.post("/register", authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập (user, admin, shipper)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - password
 *             properties:
 *               user_name:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     role:
 *                       type: string
 *                     id:
 *                       type: integer
 *       401:
 *         description: Sai mật khẩu hoặc không tồn tại tài khoản
 */
router.post("/login", authController.login);

// XÓA các route GET profile
// router.get("/profile", authMiddleware, authController.getProfile);
// router.get(
//   "/admin/profile",
//   authMiddleware,
//   requireRole("admin"),
//   authController.getAdminProfile
// );
// router.get(
//   "/shipper/profile",
//   authMiddleware,
//   requireRole("shipper"),
//   authController.getShipperProfile
// );

module.exports = router;
