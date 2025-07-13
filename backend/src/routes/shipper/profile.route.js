const express = require("express");
const router = express.Router();
const profileController = require("../../controllers/shipper/profile.controller");
const {
  authMiddleware,
  requireRole,
} = require("../../middlewares/auth.middleware");
const {
  validateShipperProfile,
} = require("../../validators/profile.validator");

/**
 * @swagger
 * tags:
 *   name: Shipper - Profile
 *   description: API quản lý profile shipper
 */

/**
 * @swagger
 * /shipper/profile:
 *   get:
 *     summary: Lấy thông tin shipper đang đăng nhập
 *     tags: [Shipper - Profile]
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
 *                     shipper_id:
 *                       type: integer
 *                     user_name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     full_name:
 *                       type: string
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập (role shipper)
 *       500:
 *         description: Lỗi server
 */
router.get(
  "/profile",
  authMiddleware,
  requireRole("shipper"),
  profileController.getProfile
);

/**
 * @swagger
 * /shipper/profile:
 *   put:
 *     summary: Cập nhật thông tin shipper (full_name, phone)
 *     tags: [Shipper - Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - phone
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: "Mai Văn Ship"
 *               phone:
 *                 type: string
 *                 example: "0911222333"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
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
 *                     shipper_id:
 *                       type: integer
 *                     full_name:
 *                       type: string
 *                     phone:
 *                       type: string
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       401:
 *         description: Không có token hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập (role shipper)
 *       409:
 *         description: Số điện thoại đã tồn tại
 *       500:
 *         description: Lỗi server
 */
router.put(
  "/profile",
  authMiddleware,
  requireRole("shipper"),
  validateShipperProfile,
  profileController.updateProfile
);

module.exports = router;
