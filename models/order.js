const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Store = require('./store');
const {
  printfulTax,
  printfulShipping,
} = require('../services/printful');
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
  price: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    required: true,
    default: 0
  },
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

orderSchema.statics.createOrder = async function ( data, orderId, merchantOrderId, customerId, paymentId, printfulData) {
  // console.log({data});
  let shippingCost = 0;
  if (data.billingAddress.country.toLowerCase() !== 'us') {
    const shippingResponse = await printfulShipping(printfulData);
    if (shippingResponse.code === 400) {
      throw new Error(shippingResponse.message)
    }
    shippingCost = shippingResponse.rate;
  }

  const taxResponse = await printfulTax(printfulData);
  if (taxResponse.code === 400) {
    throw new Error(taxResponse.message)
  }
  const taxRate = taxResponse.rate;

  const productIds = data.products.map(p => p.productId);
  // console.log({ productIds });
  // const products = await VendorProduct.find({  productId: { $in: productIds }, storeId: data.storeId })
  // console.log({ products });
  const store = await Store.findOne({ slug: data.storeUrl }).select('_id vendorId')
// console.log({store});
  let selectedVariants = [];
  data.products.forEach((product) => {
    selectedVariants.push(...product.productMappings);
  })

  const subTotal = Number(data.amount.toFixed(2));
  const tax = Number((subTotal * taxRate).toFixed(2));

  let order = new this
  order._id = orderId
  order.merchantOrderId = merchantOrderId,
  order.customerId = customerId,
  order.paymentId = paymentId,
  order.storeId = store._id;
  order.vendorId = store.vendorId;
  order.products = productIds;
  order.productMappings = selectedVariants;
  order.price = subTotal;
  order.tax = tax;
  order.shippingCost = shippingCost;
  order.totalAmount = subTotal + tax + Number(shippingCost);
  order.billingAddress = data.billingAddress;

  await order.save();
  return order;
}

module.exports = mongoose.model('order', orderSchema)
