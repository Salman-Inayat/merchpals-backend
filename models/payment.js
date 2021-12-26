const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['stripe', 'paypal'],
    default: 'stripe',
  },
  transactionId: {
    type: mongoose.Types.ObjectId,
    ref: 'transaction',
  },
  customerId: {
    type: mongoose.Types.ObjectId,
    ref: 'customer',
  },
  stripeToken: {
    type: String
  },
  total: {
    type: Number,
    required: true,    
  },
  ccLast4Digits:{
    type: Number,
    required: true,
  }
},
{ timestamps: true })

module.exports = mongoose.model('payment', paymentSchema)