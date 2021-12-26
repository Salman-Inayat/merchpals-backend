const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  productNumberedId: {
    type: Number,
    enum: [],//TODO: need to update values here
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    enum: [], //TODO: need to update values here
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  variant: {
    type: [String]
  },
  colors: {
    type: [String]
  },
  basePrice: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true,
  },
  minPrice: {
    type: Number,
  },
  shippingFee: {
    type: Number
  },
  background: {
   type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema);