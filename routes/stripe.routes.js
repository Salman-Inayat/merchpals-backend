const router = require('express').Router();
const {
  createAccount,
  getAccountInfo,
  payout,
  getTransactionHistory,
} = require('../controller/stripe');
const auth = require('../middleware/auth');

router.route('/account').post(auth, createAccount);
router.route('/account').get(auth, getAccountInfo);
router.route('/payout').post(auth, payout);
router.route('/history').get(auth, getTransactionHistory);

module.exports = router;
