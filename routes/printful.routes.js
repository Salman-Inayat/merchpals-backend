const express = require("express");
const router = express.Router();
const { calculatePrice } = require('../controller/printful');

router.route('/calculate-price').post(calculatePrice);

module.exports = router;
