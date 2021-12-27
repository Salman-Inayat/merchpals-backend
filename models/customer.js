const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * @field orderHistory 
 * @description Array of ObjectIds of all the orders a customer has ever placed
 * @reference order table -> _id
 */
const customerSchema = new mongoose.Schema({
  orderHistory: {
    type: [ObjectId], 
    ref: 'order'
  },
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
},
{ timestamps: true })

module.exports = mongoose.model('customer', customerSchema);