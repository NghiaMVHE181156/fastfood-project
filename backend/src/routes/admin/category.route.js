const express = require("express");
const router = express.Router();
const categoryController = require("../../controllers/admin/category.controller");
const {
  validateCategory,
  validateCategoryUpdate,
} = require("../../validators/category.validator");
const { authMiddleware } = require("../../middlewares/auth.middleware");
const checkRole = require("../../middlewares/role.middleware");

/**
 * @swagger
 * tags:
 *   name: Admin - Category
 *   description: Admin category management
 */

// Áp dụng middleware xác thực và kiểm tra quyền admin cho tất cả route
router.use(authMiddleware);
router.use(checkRole(["admin"]));

/**
 * @swagger
 * /admin/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Admin - Category]
 *     description: Return a list of all dish categories
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search keyword for category name
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by field (id_asc, id_desc, name_asc, name_desc)
 *     responses:
 *       200:
 *         description: Fetched all categories
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Fetched all categories
 *               data: [{ id: 1, name: "Cơm", description: "Các món cơm truyền thống" }]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Admin - Category]
 *     description: Add a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "Cơm"
 *             description: "Các món cơm truyền thống"
 *     responses:
 *       200:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Category created successfully
 *               data: { id: 1, name: "Cơm", description: "Các món cơm truyền thống" }
 *       400:
 *         description: Duplicate Name
 *       422:
 *         description: Validation Failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 */
router.post("/", validateCategory, categoryController.createCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Admin - Category]
 *     description: Update existing category's name/description
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *           example:
 *             name: "Cơm"
 *             description: "Mô tả mới"
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Category updated successfully
 *               data: { id: 1, name: "Cơm", description: "Mô tả mới" }
 *       404:
 *         description: Not Found
 *       400:
 *         description: Duplicate Name
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 */
router.put("/:id", validateCategoryUpdate, categoryController.updateCategory);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Admin - Category]
 *     description: Delete a category if no dish is associated
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Category deleted successfully
 *       404:
 *         description: Not Found
 *       409:
 *         description: Cannot delete if Dish exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 */
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
