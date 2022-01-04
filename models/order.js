const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * 
 * @field size
 * @field shippingCose
 * @field tax
 * @field totalAmount
 * 
 */
const orderSchema = new mongoose.Schema({
  products: {
    type: [ObjectId],
    required: true
  },
  vendorId: {
    type: ObjectId,
    required: true
  },
  storeId: {
    type: ObjectId,
    required: true
  },
  customerId: {
    type: ObjectId,
    required: true
  },
  merchantOrderId: {
    type: ObjectId,
    required: true
  },
  paymentId: {
    type: ObjectId,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  // shippingCost can be zero (in case of US)
  // fetched from API
  shippingCost: {
    type: Number,
    required: true
  },
  // fetched from API
  tax: {
    type: Number,
    required: true
  },
  // price (vendorproduct table) + shippingCost (order table) + tax (order table)
  totalAmount: {
    type: Number,
    required: true
  },
  billingAddress: {
    houseNo: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    zip: {
      type: String
    },
    country: {
      type: String,
      required: true      
    }
  },
}, { timestamps: true });

module.exports = mongoose.model('order', orderSchema)