const express = require("express");
const router = express.Router();
const uploadImage = require("../utils/uploadImage");

/**
 * @swagger
 * tags:
 *   name: Profile - Upload
 *   description: API upload ảnh đại diện/profile cho user, admin, shipper
 */

/**
 * @swagger
 * /profile/upload-image:
 *   post:
 *     summary: Upload ảnh đại diện/profile
 *     tags: [Profile - Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload thành công, trả về url ảnh
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 url:
 *                   type: string
 *                   example: https://res.cloudinary.com/.../image.jpg
 *       400:
 *         description: Không có file ảnh
 *       500:
 *         description: Lỗi server
 */
router.post("/upload-image", async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(400)
        .json({ success: false, message: "No image file uploaded" });
    }
    const buffer = req.files.image.data;
    const url = await uploadImage(buffer, "uploads");
    return res.json({ success: true, url });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
