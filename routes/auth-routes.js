const express = require("express");
const { userSignup, sendOTP, verifyOTP } = require("../controller/authController");
const router = express.Router();

router.route("/sign-up")
    .post(userSignup)


router.route("/send-otp").post(sendOTP)
router.route("/verify-otp").post(verifyOTP)

module.exports = router;
