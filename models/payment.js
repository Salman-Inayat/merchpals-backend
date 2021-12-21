const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['stripe', 'paypal'],
    default: 'stripe',
  },
  transactionId: {
    type: mongoose.Types.ObjectId,
    ref: 'Transaction',
  },
  customerId: {
    type: mongoose.Types.ObjectId,
    ref: 'Customer',
  },
  stripeToken: {
    type: String
  },
  amount: {
    type: Number,
    required: true,
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

module.exports = mongoose.model('Payment', paymentSchema)