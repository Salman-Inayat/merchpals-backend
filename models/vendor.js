const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
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