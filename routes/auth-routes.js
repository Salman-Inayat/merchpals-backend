const express = require("express");
const { 
  userSignup, 
  sendOTP, 
  verifyOTP, 
  sendOTPForResetPassword,
  updatePassword
} = require("../controller/authController");

const router = express.Router();

router.route("/sign-up").post(userSignup)
router.route("/send-otp").post(sendOTP)
router.route("/verify-otp").post(verifyOTP)
router.route("/send-otp-for-reset-password").post(sendOTPForResetPassword)
router.route('/update-password').put(updatePassword)
module.exports = router;
