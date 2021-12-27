const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * 
 * @field transactionId
 * @field customerId
 * @field stripeToken
 * @field totalAmount
 * 
 */
const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: ObjectId,
    ref: 'transaction',
  },
  customerId: {
    type: ObjectId,
    ref: 'customer',
  },
  method: {
    type: String,
    enum: ['stripe', 'paypal'],
    default: 'stripe',
  },
  stripeToken: {
    type: String
  },
  totalAmount: {
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