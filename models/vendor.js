const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * 
 * @field balance
 * @description Current Earnings of the vendor
 * 
 * @field hasAcceptedTerms
 * @description Has vendor accepted platforms terms and conditions or not
 * 
 * @field socialHandles
 * @description URLs of different social media accounts reflecting the vendor
 * 
 */

const vendorSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNo: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0
  },
  avatar:{
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  },
  hasAcceptedTerms: {
    type: Boolean,
    default: false
  },
  socialHandles: {
    tiktok: '',
    instagram: '',
    facebook: '',
    twitter: '',
  },
  profitMargin: {
    type: Number,
    default: 0.75
  },
  paymentMethod: {
    type: String,
    enum: ['stripe'],
    default: 'stripe'
  }
}, 
{ timestamps: true });

module.exports = mongoose.model('vendor', vendorSchema);