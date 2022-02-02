const mongoose = require('mongoose');
const ProductMapping = require('./productMapping');
const Store = require('./store');
const ObjectId = mongoose.Schema.Types.ObjectId;
const {
  printfulOrder
} = require('../services/printful');

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
const merchantOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: ObjectId,
      ref: 'order',
      required: true,
    },
    printfulOrderId: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

merchantOrderSchema.statics.createOrder = async function (
  order,
  merchantOrderId,
) {
  console.log({ order });
  const printfulDataFormatted = {
    recipient: {
      address1: `${order.billingAddress.aptNo} ${order.billingAddress.street}`,
      city: order.billingAddress.city,
      country_code: order.billingAddress.country,
      state_code: order.billingAddress.state,
      zip: order.billingAddress.zip,
    },
    items: order.products.map(product => ({
      variant_id: product.productMapping.variantId,
      quantity: product.quantity,
      files: [{ url: product.vendorProduct.designId.url }]
    }))
}

  const printfulOrderResponse = await printfulOrder(printfulDataFormatted)

  if (printfulOrderResponse.code === 400) {
    throw new Error(printfulOrderResponse.message)
  }

  const merchantOrder = await this.create({
    _id: merchantOrderId,
    orderId: order._id,
    printfulOrderId: printfulOrderResponse.id,
    totalAmount: Number(order.price) // TODO: clearify this amount
  });

  // return merchantOrder;
  return true;
};

module.exports = mongoose.model('merchantOrder', merchantOrderSchema);
