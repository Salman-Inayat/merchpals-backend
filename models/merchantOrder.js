const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * 
 * @field keyId
 * @description system defined ID of a product variant for internal usage
 * @reference productMapping table -> keyId (parent)
 * 
 * @field variantId
 * @description system defined ID of a product variant which we can show-piece to merchant
 * @reference productMapping table -> variantId (parent)
 * 
 * @field price
 * @field tax
 * @field shippingAmount
 * @field totalAmount
 * 
 */
const merchantOrderSchema = new mongoose.Schema({
  products: {
    type: [ObjectId],
    ref: 'product',
    required: true    
  },
  orderId: {
    type: ObjectId,
    ref: 'order',
    required: true
  },
  keyId: {
    type: String,
    required: true
  },
  variantId: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
},
{ timestamps: true });

module.exports = mongoose.model('merchantOrder', merchantOrderSchema)