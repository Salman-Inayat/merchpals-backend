const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  productId: {
    type: [mongoose.Types.ObjectId],
    required: true
  },
  vendorId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  storeId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  customerId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  merchantOrderId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  paymentId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  size: {
    type: String,
    required: true
  },
  shippingCost: {
    type: Number,
    required: true
  },
  taxAmount: {
    type: Number,
    required: true
  },
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