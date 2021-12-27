const mongoose = require('mongoose');

/**
 * @field productNumberedId
 * @description
 * 
 * @field variant
 * @description The value of this field depends on the product. 
 * 
 * @field color
 * @description
 * 
 * @field keyId
 * @description
 * 
 * @field variantId
 * @description
 * 
 */
const productMapping = new mongoose.Schema({
  productNumberedId: {
    type: Number,
    required: true,
  },
  variant: {
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