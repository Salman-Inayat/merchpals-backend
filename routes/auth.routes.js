const express = require("express");
const { 
  userSignup, 
  sendOTP, 
  verifyOTP, 
  sendOTPForResetPassword,
  updatePassword,
  login,
  loggedInUserInfo
} = require("../controller/auth");
const auth = require('../middleware/auth');

const router = express.Router();

router.route("/sign-up").post(userSignup)
router.route("/send-otp").post(sendOTP)
router.route("/verify-otp").post(verifyOTP)
router.route("/send-otp-for-reset-password").post(sendOTPForResetPassword)
router.route('/update-password').put(updatePassword)
router.route('/login').post(login)
router.route('/').get(auth, loggedInUserInfo)

module.exports = router;
