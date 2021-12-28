const router = require('express').Router();
const { addProducts } = require('../controller/product');

router.route('/').post(addProducts)

module.exports = router;