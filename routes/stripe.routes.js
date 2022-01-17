const router = require('express').Router();
const { createAccount, getAccountInfo } = require('../controller/stripe');
const auth = require('../middleware/auth');

router.route('/account').post(auth, createAccount);
router.route('/account').get(auth, getAccountInfo);

module.exports = router;
