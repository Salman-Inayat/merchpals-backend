const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const VendorProduct = require('./vendorProduct');

/**
 * 
 * @field size
 * @field shippingCose
 * @field tax
 * @field totalAmount
 * 
 */
const orderSchema = new mongoose.Schema({
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
  vendorId: {
    type: ObjectId,
    required: true
  },
  storeId: {
    type: ObjectId,
    required: true
  },
  customerId: {
    type: ObjectId,
    required: true
  },
  merchantOrderId: {
    type: ObjectId,
    required: true
  },
  paymentId: {
    type: ObjectId,
    required: true
  },
  // size: {
  //   type: String,
  //   required: true
  // },
  // shippingCost can be zero (in case of US)
  // fetched from API
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  // fetched from API
  tax: {
    type: Number,
    required: true,
    default: 0
  },
  // price (vendorproduct table) + shippingCost (order table) + tax (order table)
  totalAmount: {
    type: Number,
    required: true
  },
  billingAddress: {
    aptNo: {
      type: String,
      required: true
    },
    street: {
      type: String,
      required: true
    },
    zip: {
      type: String
    },
    city: {
      type: String,
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true      
    }
  },
}, { timestamps: true });

orderSchema.statics.createOrder = async function (user, data, orderId, merchantOrderId, customerId, paymentId) {
  // console.log({data});
  const productIds = data.products.map(p => p.productId);
  // console.log({ productIds });
  const products = await VendorProduct.find({  productId: { $in: productIds }, storeId: data.storeId })
  // console.log({ products });

  let selectedVariants = [];
  data.products.forEach((product) => {
    selectedVariants.push(...product.productMappings);
  })

  let order = new this
  order._id = orderId
  order.merchantOrderId = merchantOrderId,
  order.customerId = customerId,
  order.paymentId = paymentId,
  order.storeId = data.storeId;
  order.vendorId = user.vendorId;
  order.products = productIds;
  order.productMappings = selectedVariants;
  order.totalAmount = products.reduce((sum, product) => sum + product.price, 0)
  order.billingAddress = data.billingAddress;
  await order.save();
  return order;
}

module.exports = mongoose.model('order', orderSchema)