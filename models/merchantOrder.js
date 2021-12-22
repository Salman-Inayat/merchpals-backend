const mongoose = require('mongoose');

const merchantOrderSchema = new mongoose.Schema({
  productId: {
    type: [mongoose.Types.ObjectId],
    required: [true, 'Products can not be empty!']
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
  orderId: {
    type: mongoose.Types.ObjectId,
    ref: 'Order'
  }
},
{ timestamps: true });

module.exports = mongoose.model('MerchantOrder', merchantOrderSchema)