const express = require("express");
const router = express.Router();
const menuController = require("../../controllers/user/menu.controller");

/**
 * @swagger
 * tags:
 *   name: Public - Menu
 *   description: API public lấy menu món ăn cho user
 */

/**
 * @swagger
 * /menu/categories:
 *   get:
 *     summary: Lấy tất cả danh mục món ăn
 *     tags: [Public - Menu]
 *     responses:
 *       200:
 *         description: Lấy thành công tất cả danh mục
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
 *                     type: object
 *                     properties:
 *                       category_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/categories", menuController.getAllCategories);

/**
 * @swagger
 * /menu/dishes:
 *   get:
 *     summary: Lấy danh sách món ăn theo category (có phân trang)
 *     tags: [Public - Menu]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         required: false
 *         description: category_id để lọc món ăn
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Trang hiện tại (10 item/trang)
 *     responses:
 *       200:
 *         description: Lấy thành công danh sách món ăn
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
 *                     type: object
 *                     properties:
 *                       dish_id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       price:
 *                         type: integer
 *                       image_url:
 *                         type: string
 *                       is_available:
 *                         type: boolean
 *                       category_id:
 *                         type: integer
 *       400:
 *         description: category param không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/dishes", menuController.getDishesByCategory);

/**
 * @swagger
 * /menu/dishes/{id}:
 *   get:
 *     summary: Lấy chi tiết món ăn theo dish_id
 *     tags: [Public - Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID của món ăn
 *     responses:
 *       200:
 *         description: Lấy thành công chi tiết món ăn
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
 *                     dish_id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: integer
 *                     image_url:
 *                       type: string
 *                     category_id:
 *                       type: integer
 *                     is_available:
 *                       type: boolean
 *       400:
 *         description: dish_id không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Không tìm thấy món ăn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Lỗi server
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/dishes/:id", menuController.getDishDetail);

module.exports = router;
