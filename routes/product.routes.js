const router = require('express').Router();
const { 
  addProducts, 
  fetchProducts,
  productInfo 
} = require('../controller/product');

router.route('/').post(addProducts)
router.route('/').get(fetchProducts)
router.route('/:storeUrl/product/:productId').get(productInfo)

module.exports = router;