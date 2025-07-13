const express = require("express");
const router = express.Router();
const dishController = require("../../controllers/admin/dish.controller");
const {
  validateDish,
  validateDishUpdate,
} = require("../../validators/dish.validator");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/role.middleware");
const multer = require("multer");

// Multer config cho upload ảnh
const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * @swagger
 * tags:
 *   - name: Admin - Dish
 *     description: Quản lý món ăn (Admin)
 */

// Áp dụng middleware cho tất cả route
router.use(authMiddleware);
router.use(checkRole(["admin"]));

/**
 * @swagger
 * /admin/dishes:
 *   get:
 *     summary: Lấy danh sách món ăn
 *     tags: [Admin - Dish]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *         description: Trang
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *         description: Số lượng/trang
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Tìm kiếm theo tên
 *       - in: query
 *         name: category
 *         schema: { type: integer }
 *         description: Lọc theo category_id
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *         description: Sắp xếp (price_asc, price_desc, name_asc, name_desc, category_asc, category_desc)
 *       - in: query
 *         name: is_available
 *         schema:
 *           type: boolean
 *         description: "Lọc theo trạng thái hoạt động (true: còn bán, false: đã ẩn)"
 *     responses:
 *       200:
 *         description: Danh sách món ăn
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Fetched all dishes
 *               data: [{ dish_id: 1, name: "Mì xào bò", price: 40000, image_url: "...", category_id: 2, is_available: true }]
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       500: { description: Server error }
 */
router.get("/", dishController.getAllDishes);

/**
 * @swagger
 * /admin/dishes:
 *   post:
 *     summary: Thêm món ăn mới
 *     tags: [Admin - Dish]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category_id]
 *             properties:
 *               name: { type: string, example: "Mì xào bò" }
 *               description: { type: string, example: "Mì xào bò cay tê" }
 *               price: { type: integer, example: 40000 }
 *               image_url: { type: string, example: "https://.../bo.jpg" }
 *               category_id: { type: integer, example: 2 }
 *               is_available: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Tạo thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Dish created successfully
 *               data: { dish_id: 1, name: "Mì xào bò", ... }
 *       400: { description: Duplicate name }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       422: { description: Validation failed }
 *       500: { description: Server error }
 */
router.post("/", validateDish, dishController.createDish);

/**
 * @swagger
 * /admin/dishes/{id}:
 *   put:
 *     summary: Cập nhật món ăn
 *     tags: [Admin - Dish]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Mì xào bò" }
 *               description: { type: string, example: "Mì xào bò cay tê" }
 *               price: { type: integer, example: 40000 }
 *               image_url: { type: string, example: "https://.../bo.jpg" }
 *               category_id: { type: integer, example: 2 }
 *               is_available: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Dish updated successfully
 *               data: { dish_id: 1, name: "Mì xào bò", ... }
 *       400: { description: Duplicate name }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 *       422: { description: Validation failed }
 *       500: { description: Server error }
 */
router.put("/:id", validateDishUpdate, dishController.updateDish);

/**
 * @swagger
 * /admin/dishes/{id}:
 *   delete:
 *     summary: Xóa món ăn
 *     tags: [Admin - Dish]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Dish deleted successfully
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       404: { description: Not found }
 *       409: { description: Referenced in OrderItem }
 *       500: { description: Server error }
 */
router.delete("/:id", dishController.deleteDish);

/**
 * @swagger
 * /admin/dishes/upload:
 *   post:
 *     summary: Upload ảnh món ăn lên Cloudinary
 *     tags: [Admin - Dish]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Image uploaded
 *               data: { url: "https://res.cloudinary.com/.../dish.jpg" }
 *       400: { description: Invalid file }
 *       401: { description: Unauthorized }
 *       403: { description: Forbidden }
 *       500: { description: Upload error }
 */
router.post("/upload", upload.single("file"), dishController.uploadImage);

/**
 * @swagger
 * /admin/dishes/{id}/restore:
 *   put:
 *     summary: Khôi phục món ăn (is_available = 1)
 *     tags: [Admin - Dish]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, example: 1 }
 *     responses:
 *       200:
 *         description: Khôi phục thành công
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Dish restored successfully
 *       404: { description: Not found }
 *       500: { description: Server error }
 */
router.put("/:id/restore", dishController.restoreDish);

module.exports = router;
