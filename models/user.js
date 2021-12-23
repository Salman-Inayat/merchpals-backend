const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      requied: [true, 'First Name is required'],
    },
    // middleName: { type: String },
    lastName: { type: String },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: { type: Number, required: [true, 'Phone No is required'] },
    phoneNoVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      require: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordChangedAt: Date,
    status: {
      type: String,
      default: 'pending', // status is pending until phoneNo is verified: phoneNoVerified: true
      enum: ['active', 'inactive', 'suspended', 'pending'],
      select: false,
    },
    username: { type: String, required: false },
    role: {
      type: String,
      enum: ['vendor'],
      default: 'vendor',
    },
  },
  { timestamps: true },
);

// Bcrypting the password and saving it to db
userSchema.pre('save', async function (next) {
  try {
    if (this.firstName.length < 3) {
      throw new Error('First name should contain atleast 3 letters');
    }

    if (this.isModified('password')) {
      // Hash the password with cost of 12
      this.password = await bcrypt.hash(this.password, 12);
      this.passwordChangedAt = Date.now();
    }

    next();
  } catch (error) {
    console.log('user presave error', error.message);
  }
});

// Instance method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  const isSame = await bcrypt.compare(candidatePassword, userPassword);
  return isSame;
};

// Instance method to check if the password has been changed after issuing the jwt token
userSchema.methods.passwordChangeAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    // False means that password does not changed
    // if changed time stamp is greater than the time issued the token
    return JWTTimestamp < changedTimeStamp;
  }

  // it means that password has never been changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // Generate the random token of 32 characters
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Create the hash of the token that has been generate and encrypt it with sha 256
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set the password reset to the 10 minutes in the future
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(
    `Reset Token: ${resetToken}, \nPassword Reset Token: ${this.passwordResetToken}`,
  );
  // this will be sent through
  return resetToken;
};

userSchema.statics.createUser = async function (data) {
  const errors = {};

  if (data.phoneNo) {
    const duplicatePhoneNo = await this.findOne({ phoneNo: data.phoneNo });
    if (duplicatePhoneNo) {
      errors.phoneNo = 'Phone Number already exists';
    }
  }

  if (data.email) {
    const duplicateEmail = await this.findOne({ email: data.email });
    if (duplicateEmail) {
      errors.email = 'Email already exists';
    }
  }

  if (Object.keys(errors).length > 0) {
    throw { name: 'object', message: JSON.stringify(errors) };
  }

  const user = await this.create({ ...data });
  return user;
};

userSchema.statics.updatePhoneVerification = async function (phoneNo) {
  try {
    const user = await this.findOneAndUpdate(
      { phoneNo },
      {
        phoneNoVerified: true,
        status: 'active',
      },
    );
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

// userSchema.plugin(uniqueValidator, { message: "{PATH} should be unique" });

module.exports = mongoose.model('User', userSchema);
