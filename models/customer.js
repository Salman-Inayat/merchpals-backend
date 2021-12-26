const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true
  },
  lastName: {
    type: String,
    trim: true,
    required: true
  },
  phoneNo: {
    type: [String],
    required: true
  },
  email: {
    type: [String],
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  orderHistory: {
    type: mongoose.Types.ObjectId, 
    ref: 'order'
  },
},
{ timestamps: true })

module.exports = mongoose.model('customer', customerSchema);