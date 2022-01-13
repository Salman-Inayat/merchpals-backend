const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const productRoutes = require('./product.routes');
const storeRoutes = require('./store.routes');
const orderRoutes = require('./order.routes');
const printfulRoutes = require('./printful.routes');

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/store", storeRoutes);
router.use("/order", orderRoutes);
router.use("/printful", printfulRoutes);

module.exports = router;
