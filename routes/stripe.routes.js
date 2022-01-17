const router = require('express').Router();
const { createAccount, getAccountInfo } = require('../controller/stripe');
const auth = require('../middleware/auth');

router.route('/account').post(createAccount);
router.route('/account').get(getAccountInfo);

module.exports = router;
