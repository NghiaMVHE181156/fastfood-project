const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/role.middleware");
const controller = require("../../controllers/admin/shipper.controller");
const {
  createShipperValidator,
  updateShipperValidator,
} = require("../../validators/shipper.validator");
const { validationResult } = require("express-validator");

// Middleware validate
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      error: { code: "VALIDATION_ERROR", details: errors.array() },
    });
  }
  next();
}

// Áp dụng middleware cho tất cả route
router.use(authMiddleware);
router.use(checkRole(["admin"]));

/**
 * @swagger
 * tags:
 *   - name: Admin - Shipper
 *     description: Quản lý tài khoản shipper (chỉ admin)
 */

/**
 * @swagger
 * /admin/shippers:
 *   get:
 *     summary: Lấy danh sách tất cả shipper
 *     tags: [Admin - Shipper]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thành công
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Shipper'
 *       401:
 *         description: Không xác thực
 *       403:
 *         description: Không có quyền
 *       500:
 *         description: Lỗi server
 */
router.get("/", controller.getAllShippers);

/**
 * @swagger
 * /admin/shippers:
 *   post:
 *     summary: Tạo mới shipper
 *     tags: [Admin - Shipper]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ShipperCreate'
 *     responses:
 *       201:
 *         description: Tạo thành công
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
 *                   $ref: '#/components/schemas/Shipper'
 *       400:
 *         description: Trùng email/phone hoặc lỗi định dạng
 *       401:
 *         description: Không xác thực
 *       403:
 *         description: Không có quyền
 *       422:
 *         description: Lỗi validate
 *       500:
 *         description: Lỗi server
 */
router.post("/", createShipperValidator, validate, controller.createShipper);

/**
 * @swagger
 * /admin/shippers/{id}:
 *   put:
 *     summary: Cập nhật thông tin shipper (chỉ profile)
 *     tags: [Admin - Shipper]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của shipper
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Nguyễn Văn Giao
 *               email:
 *                 type: string
 *                 example: ship01@fastfood.vn
 *               phone:
 *                 type: string
 *                 example: '0911222333'
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
 *                   $ref: '#/components/schemas/Shipper'
 *       400:
 *         description: Trùng email/phone hoặc lỗi định dạng
 *       401:
 *         description: Không xác thực
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy shipper
 *       422:
 *         description: Lỗi validate
 *       500:
 *         description: Lỗi server
 */
router.put("/:id", updateShipperValidator, validate, controller.updateShipper);

/**
 * @swagger
 * /admin/shippers/{id}:
 *   delete:
 *     summary: Xóa shipper (nếu không bị tham chiếu)
 *     tags: [Admin - Shipper]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của shipper
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Không xác thực
 *       403:
 *         description: Không có quyền
 *       404:
 *         description: Không tìm thấy shipper
 *       409:
 *         description: Đang được tham chiếu (không xóa được)
 *       500:
 *         description: Lỗi server
 */
router.delete("/:id", controller.deleteShipper);

/**
 * @swagger
 * components:
 *   schemas:
 *     Shipper:
 *       type: object
 *       properties:
 *         shipper_id:
 *           type: integer
 *           example: 1
 *         user_name:
 *           type: string
 *           example: shipper_01
 *         full_name:
 *           type: string
 *           example: Nguyễn Văn Giao
 *         email:
 *           type: string
 *           example: ship01@fastfood.vn
 *         phone:
 *           type: string
 *           example: '0911222333'
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: '2025-07-13T10:11:00.000Z'
 *     ShipperCreate:
 *       type: object
 *       required:
 *         - user_name
 *         - full_name
 *         - email
 *         - phone
 *         - password
 *       properties:
 *         user_name:
 *           type: string
 *           example: shipper_01
 *           description: "Bắt buộc, phải bắt đầu bằng 'shipper_'"
 *         full_name:
 *           type: string
 *           example: Nguyễn Văn Giao
 *         email:
 *           type: string
 *           example: ship01@fastfood.vn
 *         phone:
 *           type: string
 *           example: '0911222333'
 *         password:
 *           type: string
 *           example: 'plaintext'
 *           description: "Bắt buộc, sẽ được hash trước khi lưu"
 */

module.exports = router;
