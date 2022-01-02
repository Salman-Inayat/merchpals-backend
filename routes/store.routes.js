const router = require('express').Router();
const { addStore, storeInfo } = require('../controller/store');
const auth = require('../middleware/auth');

router.route('/').post(auth, addStore)
router.route('/:storeId').get(storeInfo)

module.exports = router;