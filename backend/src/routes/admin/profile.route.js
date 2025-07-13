const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/admin/profile.controller");
const {
  authMiddleware,
  requireRole,
} = require("../../middlewares/auth.middleware");
const { validateAdminProfile } = require("../../validators/profile.validator");

/**
 * @swagger
 * tags:
 *   name: Admin - Profile
 *   description: API quản lý profile admin
 */

/**
 * @swagger
 * /admin/profile:
 *   get:
 *     summary: Lấy thông tin tài khoản admin đang đăng nhập
 *     tags: [Admin - Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
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
 *                     admin_id:
 *                       type: integer
 *                     user_name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập (role admin)
 *       500:
 *         description: Lỗi server
 */
router.get(
  "/profile",
  authMiddleware,
  requireRole("admin"),
  profileController.getProfile
);

module.exports = router;
