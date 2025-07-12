const express = require("express");
const router = express.Router();

// Import các routes khác
// const userRoutes = require('./userRoutes');
// const dishRoutes = require('./dishRoutes');
// const orderRoutes = require('./orderRoutes');
const adminCategoryRoute = require("./admin/category.route");

// Sử dụng các routes
// router.use('/users', userRoutes);
// router.use('/dishes', dishRoutes);
// router.use('/orders', orderRoutes);
router.use("/admin", adminCategoryRoute);

// Route test cho API
router.get("/test", (req, res) => {
  res.json({ message: "API Routes are working!" });
});

module.exports = router;
