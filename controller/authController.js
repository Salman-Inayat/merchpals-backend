const twilioClient = require("../config/twilio");
const AppError = require("../utils/appError")
const { catchAsync } = require("./errorController");




                        exports.userSignup = catchAsync(async (req, res, next) => {
                          const verification = await createAndSendOTP(req.body.phoneNo);
                          res.status(200).json({
                            message: "SignUp Successful",
                          });
                        });

             exports.createVerificationService = catchAsync(async (req, res, next) => {
  // Create a verification service
  const service = await twilioClient.verify.services.create({
    friendlyName: "Merchpals",
    codeLength: 4,
  });
});

exports.sendOTP = catchAsync(async (req, res, next) => {
  const phoneNo = req.body.phoneNo;
  try {
    const verification = await createAndSendOTP(phoneNo);
    return res.status(200).json({
      verification,
    });
  } catch (err) {
    throw next(new AppError(err.details, err.status));
  }
});

const createAndSendOTP = (phoneNo) => {
  return twilioClient.verify
    .services(process.env.TWILIO_MERCHPALS_VERIFICATION_SERVICE)
    .verifications.create({
      to: phoneNo,
      channel: "sms",
    });
};

exports.verifyOTP = catchAsync(async (req, res, next) => {
  try {
    const verificationCheck = await twilioClient.verify
      .services(process.env.TWILIO_MERCHPALS_VERIFICATION_SERVICE)
      .verificationChecks.create({ to: req.body.phoneNo, code: req.body.code });

    res.status(200).json({
      verificationCheck,
    });
  } catch (err) {
    console.log('caught error');
    res.status(err.status).json({
        message: "Verification not found"
    })
    // next(new AppError('verification code expired', 400));
  }
});
 