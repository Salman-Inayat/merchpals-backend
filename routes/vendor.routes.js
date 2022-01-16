const router = require('express').Router();
const { getVendorInfo } = require('../controller/vendor');
const auth = require('../middleware/auth');

router.route('/profile').get(auth, getVendorInfo);

module.exports = router;
