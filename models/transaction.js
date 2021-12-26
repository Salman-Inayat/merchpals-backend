const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  paymentId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  vendorId: {
    type: mongoose.Types.ObjectId,
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