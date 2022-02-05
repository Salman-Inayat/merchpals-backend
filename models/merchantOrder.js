const mongoose = require('mongoose');
const moment = require('moment');
const ProductMapping = require('./productMapping');
const Store = require('./store');
const ObjectId = mongoose.Schema.Types.ObjectId;
const { VENDOR_PROFIT_MARGIN, MERCHPALS_PROFIT_MARGIN } = require('../constants/margins');
const Escrow = require('./escrow');
const { printfulOrder } = require('../services/printful');
const { calculateProfit } = require('../services/calculateAmount');
const { SUCCEEDED, FAILED, PENDING } = require('../constants/statuses');
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

merchantOrderSchema.statics.createOrder = async function (order, merchantOrderId, printfulData) {
  console.log({ order });
  const printfulDataFormatted = {
    recipient: {
      address1: `${printfulData.recipient.aptNo} ${printfulData.recipient.street}`,
      city: printfulData.recipient.city,
      country_code: printfulData.recipient.country,
      state_code: printfulData.recipient.state,
      zip: printfulData.recipient.zip,
      tax_number: printfulData.recipient.tax_number,
    },
    items: order.products.map(product => ({
      variant_id: product.productMapping.variantId,
      quantity: product.quantity,
      files: [{ url: product.vendorProduct.designId.url }],
    })),
  };

  const printfulOrderResponse = await printfulOrder(printfulDataFormatted);

  if (printfulOrderResponse.code === 400) {
    throw new Error(printfulOrderResponse.message);
  }

  const merchantOrder = await this.create({
    _id: merchantOrderId,
    orderId: order._id,
    printfulOrderId: printfulOrderResponse.id,
    totalAmount: Number(order.price), // TODO: clearify this amount
  });

  const profit = await calculateProfit(order, printfulOrderResponse.costs);
  console.log({ profit });
  const ascrow = await Escrow.create({
    vendorId: order.vendorId,
    orderId: order._id,
    totalProfit: profit,
    vendorProfit: Number(profit * VENDOR_PROFIT_MARGIN.toFixed(2)),
    merchpalsProfit: Number(profit * MERCHPALS_PROFIT_MARGIN.toFixed(2)),
    releaseDate: moment().add(7, 'days'),
    status: PENDING,
  });

  return printfulOrderResponse;
};

module.exports = mongoose.model('merchantOrder', merchantOrderSchema);
