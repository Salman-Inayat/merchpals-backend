const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * 
 * @field amount
 * @description
 * 
 * @field totalPayout
 * @description
 * 
 */
const transactionSchema = new mongoose.Schema({
  paymentId: {
    type: ObjectId,
    required: true
  },
  vendorId: {
    type: ObjectId,
    ref: 'vendor',
    required: true
  },  
  amount: { // Amount after deduction
    type: Number,
    required: true,
  },
  totalPayout: {
    type: Number,
  },
  //TODO: what are transaction statuses here. e.g. pending, delivered. failed
  status: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('transaction', transactionSchema)