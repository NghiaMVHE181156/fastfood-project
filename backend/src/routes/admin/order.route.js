const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/role.middleware");
const adminOrderController = require("../../controllers/admin/order.controller");

/**
 * @swagger
 * tags:
 *   - name: Admin - Đơn hàng
 *     description: API quản lý đơn hàng cho admin
 *
 * components:
 *   schemas:
 *     AdminOrder:
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         user_name:
 *           type: string
 *         status:
 *           type: string
 *         is_flagged:
 *           type: boolean
 *         boom_count:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *
 * /admin/orders:
 *   get:
 *     summary: Lấy toàn bộ đơn hàng (có thể lọc đơn bị bom)
 *     tags: [Admin - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: bomb
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Lọc đơn hàng bị bom (status = 'bomb')
 *     responses:
 *       200:
 *         description: Danh sách đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AdminOrder'
 *             example:
 *               success: true
 *               data:
 *                 - order_id: 1
 *                   user_id: 2
 *                   user_name: "Nguyen Van A"
 *                   status: "bomb"
 *                   is_flagged: true
 *                   boom_count: 2
 *                   created_at: "2024-06-01 10:00:00"
 *
 * /admin/orders/{orderId}/confirm-bomb:
 *   patch:
 *     summary: Xác nhận khách hàng bom đơn (tăng count, set is_flagged nếu cần)
 *     tags: [Admin - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID đơn hàng cần xác nhận bom
 *     responses:
 *       200:
 *         description: Xác nhận thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Đã xác nhận khách bom đơn"
 *       400:
 *         description: Không tìm thấy đơn hàng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: false
 *               message: "Không tìm thấy đơn hàng"
 *
 * /admin/orders/{userId}/unflag:
 *   patch:
 *     summary: Gỡ cờ is_flagged cho user
 *     tags: [Admin - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID user cần gỡ cờ
 *     responses:
 *       200:
 *         description: Gỡ cờ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *             example:
 *               success: true
 *               message: "Đã gỡ cờ is_flagged cho user"
 */
// Lấy toàn bộ đơn hàng, có filter bomb
router.get(
  "/orders",
  authMiddleware,
  checkRole(["admin"]),
  adminOrderController.getAllOrders
);

// Xác nhận khách hàng bom đơn (tăng count, set is_flagged nếu cần)
router.patch(
  "/orders/:orderId/confirm-bomb",
  authMiddleware,
  checkRole(["admin"]),
  adminOrderController.confirmBombOrder
);

// Gỡ cờ is_flagged cho user
router.patch(
  "/orders/:userId/unflag",
  authMiddleware,
  checkRole(["admin"]),
  adminOrderController.unflagUser
);

module.exports = router;
