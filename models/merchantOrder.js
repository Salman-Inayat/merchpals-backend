const mongoose = require('mongoose');
const ProductMapping = require('./productMapping');
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
  productMappings: {
    type: [ObjectId],
    ref: 'productMapping',
    required: true
  },
  orderId: {
    type: ObjectId,
    ref: 'order',
    required: true
  },
  keyId: {
    type: [String],
    required: true
  },
  variantId: {
    type: [String],
    required: true
  },
  price: { // TODO: need to clearify this field
    type: Number,
    required: true,
  },
  tax: { // TODO: need to clearify this field
    type: Number,
    required: true,
  },
  shippingCost: { // TODO: need to clearify this field
    type: Number,
    default: 0,
  },
  totalAmount: { // TODO: need to clearify this field
    type: Number,
    required: true,
  },
},
{ timestamps: true });

merchantOrderSchema.statics.createOrder = async function (order, merchantOrderId) {
  const productMappings = await ProductMapping.find({ _id: { $in: order.productMappings }}).select('keyId variantId').lean();
  const merchantOrder = await this.create({
    products: order.products,
    productMappings: order.productMappings,
    orderId: order._id,
    keyId: productMappings.map(p => p.keyId),
    variantId: productMappings.map(p => p.variantId),
    price: order.totalAmount,
    totalAmount: order.totalAmount,
    tax: 0,
    shippingCost: 0
  })
  
  return merchantOrder
}

module.exports = mongoose.model('merchantOrder', merchantOrderSchema)