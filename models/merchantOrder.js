const mongoose = require('mongoose');

const merchantOrderSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'product',
    required: true    
  },
  orderId: {
    type: mongoose.Types.ObjectId,
    ref: 'order',
    required: true
  },
  keyId: {
    type: String,
    required: true
  },
  variantId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  shippingAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
},
{ timestamps: true });

module.exports = mongoose.model('merchantOrder', merchantOrderSchema)