const express = require("express");
const { validationResult } = require("express-validator");
const {
  authMiddleware,
  requireRole,
} = require("../../middlewares/auth.middleware");
const orderController = require("../../controllers/user/order.controller");
const {
  createOrderValidation,
  getOrderDetailValidation,
  getOrderHistoryValidation,
} = require("../../validators/order.validator");

const router = express.Router();

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
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - dish_id
 *         - quantity
 *       properties:
 *         dish_id:
 *           type: integer
 *           description: ID của món ăn
 *           example: 1
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: Số lượng món ăn
 *           example: 2
 *
 *     CreateOrderRequest:
 *       type: object
 *       required:
 *         - items
 *         - address
 *         - payment_method
 *       properties:
 *         items:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         address:
 *           type: string
 *           minLength: 10
 *           maxLength: 500
 *           description: Địa chỉ giao hàng
 *           example: "123 Lê Lợi, Quận 1, TP.HCM"
 *         payment_method:
 *           type: string
 *           enum: [COD, VNPAY]
 *           description: Phương thức thanh toán
 *           example: "COD"
 *
 *     OrderSummary:
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           example: "preparing"
 *         total_amount:
 *           type: integer
 *           example: 95000
 *         payment_method:
 *           type: string
 *           example: "COD"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-11T13:38:54.957Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-11T13:38:54.957Z"
 *         item_count:
 *           type: integer
 *           example: 3
 *
 *     OrderHistoryResponse:
 *       type: object
 *       properties:
 *         orders:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderSummary'
 *         pagination:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *             total:
 *               type: integer
 *               example: 25
 *             totalPages:
 *               type: integer
 *               example: 3
 *
 *     OrderItemDetail:
 *       type: object
 *       properties:
 *         order_item_id:
 *           type: integer
 *           example: 1
 *         dish_id:
 *           type: integer
 *           example: 1
 *         quantity:
 *           type: integer
 *           example: 2
 *         unit_price:
 *           type: integer
 *           example: 30000
 *         dish_name:
 *           type: string
 *           example: "Cơm gà xối mỡ"
 *         dish_description:
 *           type: string
 *           example: "Cơm gà giòn rụm, ăn kèm nước mắm gừng"
 *         dish_image:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/image.jpg"
 *
 *     DeliveryLog:
 *       type: object
 *       properties:
 *         log_id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           example: "preparing"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-07-11T13:38:54.957Z"
 *         note:
 *           type: string
 *           example: "Bắt đầu chuẩn bị đơn hàng"
 *
 *     OrderDetail:
 *       type: object
 *       properties:
 *         order_id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           example: "preparing"
 *         total_amount:
 *           type: integer
 *           example: 95000
 *         payment_method:
 *           type: string
 *           example: "COD"
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-11T13:38:54.957Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2025-07-11T13:38:54.957Z"
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItemDetail'
 *         delivery_logs:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DeliveryLog'
 */

/**
 * @swagger
 * tags:
 *   name: User - Orders
 *   description: API quản lý đơn hàng của user
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Tạo đơn hàng mới
 *     tags: [User - Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderRequest'
 *           example:
 *             items:
 *               - dish_id: 1
 *                 quantity: 2
 *               - dish_id: 3
 *                 quantity: 1
 *             address: "123 Lê Lợi, Quận 1, TP.HCM"
 *             payment_method: "COD"
 *     responses:
 *       201:
 *         description: Đơn hàng được tạo thành công
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
 *                   example: "Order created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     order_id:
 *                       type: integer
 *                       example: 1
 *                     total_amount:
 *                       type: integer
 *                       example: 95000
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           dish_id:
 *                             type: integer
 *                           quantity:
 *                             type: integer
 *                           unit_price:
 *                             type: integer
 *                           name:
 *                             type: string
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
 *       401:
 *         description: Không có token xác thực hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập (role không phải user)
 *       500:
 *         description: Lỗi server
 */
router.post(
  "/",
  authMiddleware,
  requireRole("user"),
  createOrderValidation,
  handleValidationErrors,
  orderController.createOrder
);

/**
 * @swagger
 * /orders/history:
 *   get:
 *     summary: Lấy lịch sử đơn hàng của user
 *     tags: [User - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Trang hiện tại
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Số lượng đơn hàng mỗi trang
 *     responses:
 *       200:
 *         description: Lấy lịch sử đơn hàng thành công
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
 *                   example: "Order history retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/OrderHistoryResponse'
 *       400:
 *         description: Tham số query không hợp lệ
 *       401:
 *         description: Không có token xác thực hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập (role không phải user)
 *       500:
 *         description: Lỗi server
 */
router.get(
  "/history",
  authMiddleware,
  requireRole("user"),
  getOrderHistoryValidation,
  handleValidationErrors,
  orderController.getOrderHistory
);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Lấy chi tiết đơn hàng
 *     tags: [User - Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID của đơn hàng
 *     responses:
 *       200:
 *         description: Lấy chi tiết đơn hàng thành công
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
 *                   example: "Order details retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/OrderDetail'
 *       400:
 *         description: ID đơn hàng không hợp lệ
 *       401:
 *         description: Không có token xác thực hoặc token không hợp lệ
 *       403:
 *         description: Không có quyền truy cập hoặc đơn hàng không thuộc về user
 *       500:
 *         description: Lỗi server
 */
router.get(
  "/:id",
  authMiddleware,
  requireRole("user"),
  getOrderDetailValidation,
  handleValidationErrors,
  orderController.getOrderDetail
);

module.exports = router;
