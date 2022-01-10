const mongoose = require('mongoose');
const ProductMapping = require('./productMapping');
const Store = require('./store');
const { PrintfulClient } = require("printful-request");
const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY);
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
  printfulOrderId: {
    type: Number,
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

merchantOrderSchema.statics.createOrder = async function (order, storeUrl, printfulData, merchantOrderId) {
  const shippingResponse = await printful.post("shipping/rates", printfulData)
  const taxResponse = await printful.post("tax/rates", printfulData)
  
  const tax = taxResponse.result.rate;
  const shippingCost = shippingResponse.result[0].rate;

  const productMappings = await ProductMapping.find({ _id: { $in: order.productMappings }})
    .select('keyId variantId')
    .lean();
    const store = await Store.findOne({ slug: storeUrl }).populate({path: 'designs', select: 'url'})

  const designUrl = store.designs[0].url

  const printfulOrder =  await printful.post("orders", {
    ...printfulData, 
    items: printfulData.items.map(item => ({ ...item, files: [{ url: designUrl }]}))
  });
  console.log({ tax,shippingCost, printfulOrder });
  const merchantOrder = await this.create({
    _id: merchantOrderId,
    products: order.products,
    productMappings: order.productMappings,
    orderId: order._id,
    keyId: productMappings.map(p => p.keyId),
    variantId: productMappings.map(p => p.variantId),
    printfulOrderId: printfulOrder.result.id,
    price: order.totalAmount,
    totalAmount: Number(order.totalAmount) + Number(tax) + Number(shippingCost),
    tax,
    shippingCost
  })
  
  return merchantOrder
}

module.exports = mongoose.model('merchantOrder', merchantOrderSchema)