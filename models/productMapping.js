const mongoose = require('mongoose');

const productMapping = new mongoose.Schema({
  productNumberedId: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  keyId: {
    type: String,
    required: true,
  },
  variantId: {
    type: String,
    required: true,
  }        
});

module.exports = mongoose.model('productMapping', productMapping)