const router = require('express').Router();
const { addProducts, fetchProducts } = require('../controller/product');

router.route('/').post(addProducts)
router.route('/').get(fetchProducts)

module.exports = router;