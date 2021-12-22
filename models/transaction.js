const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  paymentId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  amount: { // Amount after deduction ? 
    type: Number,
    required: true,
  },
  totalPayout: {
    type: Number,
  },
  vendorId: {
    type: mongoose.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  status: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Transaction', transactionSchema)