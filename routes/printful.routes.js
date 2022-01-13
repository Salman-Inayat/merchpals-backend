const express = require("express");
const router = express.Router();
const { calculateTax, calculateShipping } = require('../controller/printful');

router.route('/calculate-tax').post(calculateTax)
router.route('/calculate-shipping').post(calculateShipping)

module.exports = router;
