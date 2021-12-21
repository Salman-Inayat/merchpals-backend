const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'Please provide first name']
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Please provide last name']    
  },
  mobileNo: {
    type: [String],
    required: [true, 'Please add a phone Number']
  },
  email: {
    type: [String],
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  orderHistory: {
    type: mongoose.Types.ObjectId, 
    ref: 'Order'
  },
},
{ timestamps: true })

module.exports = mongoose.model('Customer', customerSchema);