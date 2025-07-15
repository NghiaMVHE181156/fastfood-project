const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/role.middleware");
const orderController = require("../../controllers/shipper/order.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     AvailableOrder:
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *           description: ID của đơn hàng
 *         user_name:
 *           type: string
 *           description: Tên khách hàng
 *         address:
 *           type: string
 *           description: Địa chỉ giao hàng
 *         total_amount:
 *           type: number
 *           format: decimal
 *           description: Tổng giá trị đơn hàng
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Thời gian cập nhật đơn hàng (định dạng Vietnam timezone)
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Trạng thái thành công của request
 *         message:
 *           type: string
 *           description: Thông báo kết quả
 *         data:
 *           description: Dữ liệu trả về (nếu có)
 *         error:
 *           type: object
 *           properties:
 *             code:
 *               type: string
 *               description: Mã lỗi
 *             details:
 *               type: string
 *               description: Chi tiết lỗi
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /shipper/orders/available:
 *   get:
 *     summary: Lấy danh sách đơn hàng mới chưa có shipper nhận
 *     description: API cho phép shipper xem danh sách các đơn hàng đang chờ được giao (trạng thái pending và chưa có shipper)
 *     tags: [Shipper - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
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
 *                   example: "Get available orders successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AvailableOrder'
 *             example:
 *               success: true
 *               message: "Get available orders successfully"
 *               data:
 *                 - order_id: 123
 *                   user_name: "Nguyễn Văn A"
 *                   address: "123 Đường ABC, Quận 1, TP.HCM"
 *                   total_amount: 250000
 *                   updated_at: "2024-01-15 14:30:00"
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập hoặc token không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error:
 *                 code: "UNAUTHORIZED"
 *       403:
 *         description: Không có quyền truy cập (không phải shipper)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Access denied"
 *               error:
 *                 code: "FORBIDDEN"
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Failed to get available orders"
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 details: "Database connection error"
 */
// Lấy danh sách đơn hàng mới chưa có shipper nhận
router.get(
  "/orders/available",
  authMiddleware,
  checkRole(["shipper"]),
  orderController.getAvailableOrders
);

/**
 * @swagger
 * /shipper/orders/{id}/assign:
 *   post:
 *     summary: Shipper nhận đơn hàng
 *     description: API cho phép shipper nhận một đơn hàng cụ thể để giao
 *     tags: [Shipper - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng cần nhận
 *         example: 123
 *     responses:
 *       200:
 *         description: Nhận đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Order assigned to shipper"
 *       400:
 *         description: Tham số đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid order ID"
 *               error:
 *                 code: "INVALID_INPUT"
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập hoặc token không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error:
 *                 code: "UNAUTHORIZED"
 *       403:
 *         description: Không có quyền truy cập đơn hàng này hoặc đơn hàng đã được nhận
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Order not found or not assigned to you"
 *               error:
 *                 code: "UNAUTHORIZED_ORDER_ACCESS"
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Order not found or not assigned to you"
 *               error:
 *                 code: "UNAUTHORIZED_ORDER_ACCESS"
 */
// Shipper nhận đơn
router.post(
  "/orders/:id/assign",
  authMiddleware,
  checkRole(["shipper"]),
  orderController.assignOrderToShipper
);

/**
 * @swagger
 * /shipper/orders/{id}/onway:
 *   patch:
 *     summary: Shipper xác nhận đi giao
 *     description: API cho phép shipper xác nhận đơn hàng đã đi giao
 *     tags: [Shipper - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng cần xác nhận đi giao
 *         example: 123
 *     responses:
 *       200:
 *         description: Xác nhận đi giao thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Order on way"
 *       400:
 *         description: Tham số đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid order ID"
 *               error:
 *                 code: "INVALID_INPUT"
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập hoặc token không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error:
 *                 code: "UNAUTHORIZED"
 *       403:
 *         description: Không có quyền truy cập đơn hàng này hoặc đơn hàng đã được nhận
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Order not found or not assigned to you"
 *               error:
 *                 code: "UNAUTHORIZED_ORDER_ACCESS"
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Failed to update order on way"
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 details: "Database connection error"
 */
// Shipper xác nhận đi giao
router.patch(
  "/orders/:id/onway",
  authMiddleware,
  checkRole(["shipper"]),
  orderController.updateOrderOnWay
);

/**
 * @swagger
 * /shipper/orders/{id}/delivered:
 *   patch:
 *     summary: Shipper xác nhận giao thành công
 *     description: API cho phép shipper xác nhận đơn hàng đã giao thành công
 *     tags: [Shipper - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng cần xác nhận giao thành công
 *         example: 123
 *     responses:
 *       200:
 *         description: Xác nhận giao thành công thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Order delivered"
 *       400:
 *         description: Tham số đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid order ID"
 *               error:
 *                 code: "INVALID_INPUT"
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập hoặc token không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error:
 *                 code: "UNAUTHORIZED"
 *       403:
 *         description: Không có quyền truy cập đơn hàng này hoặc đơn hàng đã được nhận
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Order not found or not assigned to you"
 *               error:
 *                 code: "UNAUTHORIZED_ORDER_ACCESS"
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Failed to update order delivered"
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 details: "Database connection error"
 */
// Shipper xác nhận giao thành công
router.patch(
  "/orders/:id/delivered",
  authMiddleware,
  checkRole(["shipper"]),
  orderController.updateOrderDelivered
);

/**
 * @swagger
 * /shipper/orders/{id}/failed1:
 *   patch:
 *     summary: Shipper xác nhận giao thất bại lần 1
 *     description: API cho phép shipper xác nhận đơn hàng đã giao thất bại lần 1
 *     tags: [Shipper - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng cần xác nhận giao thất bại lần 1
 *         example: 123
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 nullable: true
 *                 description: Ghi chú lý do giao thất bại (có thể null)
 *           example:
 *             note: "Khách không nghe máy"
 *     responses:
 *       200:
 *         description: Xác nhận giao thất bại lần 1 thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Order failed1"
 *       400:
 *         description: Tham số đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid order ID"
 *               error:
 *                 code: "INVALID_INPUT"
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập hoặc token không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error:
 *                 code: "UNAUTHORIZED"
 *       403:
 *         description: Không có quyền truy cập đơn hàng này hoặc đơn hàng đã được nhận
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Order not found or not assigned to you"
 *               error:
 *                 code: "UNAUTHORIZED_ORDER_ACCESS"
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Failed to update order failed1"
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 details: "Database connection error"
 */
// Shipper xác nhận giao thất bại lần 1
router.patch(
  "/orders/:id/failed1",
  authMiddleware,
  checkRole(["shipper"]),
  orderController.updateOrderFailed1
);

/**
 * @swagger
 * /shipper/orders/{id}/redelivery:
 *   patch:
 *     summary: Shipper xác nhận giao lại
 *     description: API cho phép shipper xác nhận đơn hàng sẽ được giao lại
 *     tags: [Shipper - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng cần xác nhận giao lại
 *         example: 123
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 nullable: true
 *                 description: Ghi chú giao lại (có thể null)
 *           example:
 *             note: "Khách hẹn giao lại chiều"
 *     responses:
 *       200:
 *         description: Xác nhận giao lại thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Order redelivery confirmed"
 *       400:
 *         description: Tham số đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid order ID"
 *               error:
 *                 code: "INVALID_INPUT"
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập hoặc token không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error:
 *                 code: "UNAUTHORIZED"
 *       403:
 *         description: Không có quyền truy cập đơn hàng này hoặc đơn hàng không thể giao lại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Order not found or not assigned to you"
 *               error:
 *                 code: "UNAUTHORIZED_ORDER_ACCESS"
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Failed to update order redelivery"
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 details: "Database connection error"
 */
/**
 * @swagger
 * /shipper/orders/{id}/redelivery:
 *   patch:
 *     summary: Shipper xác nhận giao lại
 *     description: API cho phép shipper xác nhận đơn hàng sẽ được giao lại
 *     tags: [Shipper - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng cần xác nhận giao lại
 *         example: 123
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 nullable: true
 *                 description: Ghi chú giao lại (có thể null)
 *           example:
 *             note: "Khách hẹn giao lại chiều"
 *     responses:
 *       200:
 *         description: Xác nhận giao lại thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Order redelivery confirmed"
 *       400:
 *         description: Tham số đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid order ID"
 *               error:
 *                 code: "INVALID_INPUT"
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập hoặc token không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error:
 *                 code: "UNAUTHORIZED"
 *       403:
 *         description: Không có quyền truy cập đơn hàng này hoặc đơn hàng không thể giao lại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Order not found or not assigned to you"
 *               error:
 *                 code: "UNAUTHORIZED_ORDER_ACCESS"
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Failed to update order redelivery"
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 details: "Database connection error"
 */
// Shipper xác nhận giao lại
router.patch(
  "/orders/:id/redelivery",
  authMiddleware,
  checkRole(["shipper"]),
  orderController.updateOrderRedelivery
);

/**
 * @swagger
 * /shipper/orders/{id}/redelivered:
 *   patch:
 *     summary: Shipper xác nhận giao lại thành công
 *     description: API cho phép shipper xác nhận đơn hàng đã giao lại thành công
 *     tags: [Shipper - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng đã giao lại thành công
 *         example: 123
 *     responses:
 *       200:
 *         description: Xác nhận giao lại thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Order redelivered successfully"
 *       400:
 *         description: Tham số đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid order ID"
 *               error:
 *                 code: "INVALID_INPUT"
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập hoặc token không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error:
 *                 code: "UNAUTHORIZED"
 *       403:
 *         description: Không có quyền truy cập đơn hàng này hoặc đơn hàng không ở trạng thái giao lại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Order not found or not assigned to you"
 *               error:
 *                 code: "UNAUTHORIZED_ORDER_ACCESS"
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Failed to update order redelivered"
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 details: "Database connection error"
 */
// Shipper xác nhận giao lại thành công
router.patch(
  "/orders/:id/redelivered",
  authMiddleware,
  checkRole(["shipper"]),
  orderController.updateOrderRedelivered
);

/**
 * @swagger
 * /shipper/orders/{id}/failed2:
 *   patch:
 *     summary: Shipper xác nhận giao lại thất bại lần 2
 *     description: API cho phép shipper xác nhận đơn hàng giao lại thất bại lần thứ 2
 *     tags: [Shipper - Đơn hàng]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn hàng giao lại thất bại lần 2
 *         example: 123
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 nullable: true
 *                 description: Ghi chú lý do giao lại thất bại (có thể null)
 *           example:
 *             note: "Khách không nhận hàng lần 2"
 *     responses:
 *       200:
 *         description: Xác nhận giao lại thất bại lần 2 thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Order failed for second time"
 *       400:
 *         description: Tham số đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Invalid order ID"
 *               error:
 *                 code: "INVALID_INPUT"
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập hoặc token không hợp lệ)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error:
 *                 code: "UNAUTHORIZED"
 *       403:
 *         description: Không có quyền truy cập đơn hàng này hoặc đơn hàng không ở trạng thái giao lại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Order not found or not assigned to you"
 *               error:
 *                 code: "UNAUTHORIZED_ORDER_ACCESS"
 *       500:
 *         description: Lỗi server nội bộ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: false
 *               message: "Failed to update order failed2"
 *               error:
 *                 code: "INTERNAL_SERVER_ERROR"
 *                 details: "Database connection error"
 */
// Shipper xác nhận giao lại thất bại lần 2
router.patch(
  "/orders/:id/failed2",
  authMiddleware,
  checkRole(["shipper"]),
  orderController.updateOrderFailed2
);

module.exports = router;
