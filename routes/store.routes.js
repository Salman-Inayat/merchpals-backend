const router = require('express').Router();
const { addStore, storeInfo, validateSlug, getStoreBySlug } = require('../controller/store');
const auth = require('../middleware/auth');

router.route('/').post(auth, addStore)
router.route('/validate-slug/:slug').get(validateSlug)
router.route('/').get(auth, storeInfo)
router.route('/:slug').get(getStoreBySlug)

module.exports = router;