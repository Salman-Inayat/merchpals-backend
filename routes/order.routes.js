const router = require('express').Router();
const { createOrder } = require('../controller/order');
const auth = require('../middleware/auth');

router.route('/').post(auth, createOrder);

module.exports = router;