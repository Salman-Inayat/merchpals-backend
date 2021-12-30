const router = require('express').Router();
const { addStore, storeInfo } = require('../controller/store');

router.route('/').post(addStore)
router.route('/:storeId').get(storeInfo)

module.exports = router;