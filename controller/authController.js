const twilioClient = require('../config/twilio');
const AppError = require('../utils/appError');
const { catchAsync } = require('./errorController');
const User = require('../models/user');

const twilioOtpService = async (phoneNo) => {
  try {
    const response = await twilioClient.verify
      .services(process.env.TWILIO_MERCHPALS_VERIFICATION_SERVICE)
      .verifications.create({
        to: phoneNo,
        channel: 'sms',
      });

    return response;
  } catch (error) {
    throw new Error();
  }
};

exports.userSignup = async (req, res) => {
  try {
    const user = await User.createUser(req.body.data);
    await twilioOtpService(req.body.data.phoneNo);

    return res.status(200).json({
      user,
      message: 'SignUp Successful',
    });
  } catch (error) {
    if (error.name === 'object') {
      return res.status(400).send(error);
    }

    return res.status(400).send({ message: error.message });
  }
};

// TODO: We might do not need this function
// Delete after discussion if needed because does not even returns any value
exports.createVerificationService = catchAsync(async () => {
  // Create a verification service
  await twilioClient.verify.services.create({
    friendlyName: 'Merchpals',
    codeLength: 4,
  });
});

exports.sendOTP = catchAsync(async (req, res, next) => {
  const { phoneNo } = req.body;
  try {
    const verification = await twilioOtpService(phoneNo);
    return res.status(200).json({
      verification,
    });
  } catch (err) {
    throw next(new AppError(err.details, err.status));
  }
});

exports.verifyOTP = catchAsync(async (req, res) => {
  try {
    const otp = await twilioClient.verify
      .services(process.env.TWILIO_MERCHPALS_VERIFICATION_SERVICE)
      .verificationChecks.create({ to: req.body.phoneNo, code: req.body.code });

    if (!otp.valid) {
      throw new Error('Invalid OTP!');
    }

    const user = await User.updatePhoneVerification(req.body.phoneNo);
    res.status(200).json({ user });
  } catch (err) {
    console.log('verifyOTP func', err.status, err.message);
    res.status(500).json({ message: err.message });
  }
});
