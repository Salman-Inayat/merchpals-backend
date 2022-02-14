const mongoose = require('mongoose');
const { SUCCEEDED, FAILED, PENDING } = require('../constants/statuses');
const stripe = require('stripe')(process.env.STRIPE_SECRET_CUSTOMER_KEY);
const ObjectId = mongoose.Schema.Types.ObjectId;
const { printfulOrder } = require('../services/printful');
const { calculateProfit } = require('../services/calculateAmount');
const { VENDOR_PROFIT_MARGIN, MERCHPALS_PROFIT_MARGIN } = require('../constants/margins');
const Escrow = require('./escrow');
const moment = require('moment');

/**
 *
 * @field transactionId
 * @field customerId
 * @field stripeToken
 * @field totalAmount
 *
 */

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: ObjectId,
      ref: 'transaction',
    },
    customerId: {
      type: ObjectId,
      ref: 'customerRecord',
    },
    orderId: {
      type: ObjectId,
      ref: 'order',
    },
    method: {
      type: String,
      enum: ['stripe', 'paypal'],
      default: 'stripe',
    },
    stripeTokenId: {
      type: String,
    },
    stripeChargeId: {
      type: String,
    },
    // total amount paid via stripe
    amount: {
      type: Number,
      required: true,
    },
    ccLast4Digits: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [PENDING, SUCCEEDED, FAILED],
      default: PENDING,
    },
  },
  { timestamps: true },
);

paymentSchema.statics.createAndChargeCustomer = async function (
  paymentInfo,
  order,
  customerId,
  printfulData,
) {
  let payment = await this.create({
    _id: order.paymentId,
    customerId,
    orderId: order._id,
    amount: order.totalAmount,
    ccLast4Digits: paymentInfo.last4,
  });

  // amount is multiplied by 100 because stripe accepts amounts in integers
  // and values are in cents instead of dollars

  const charge = await stripe.charges.create({
    amount: Number((order.totalAmount * 100).toFixed(2)),
    currency: 'usd',
    source: paymentInfo.token,
    description: `customer payment for order# ${order._id}`,
  });

  // console.log({stripeResponse: charge});

  if (charge.status === SUCCEEDED) {
    payment.status = SUCCEEDED;
    payment.stripeTokenId = paymentInfo.token;
    payment.stripeChargeId = charge.id;
  } else {
    payment.status = charge.status;
    payment.stripeTokenId = paymentInfo.token;
  }

  await payment.save();

  const printfulDataFormatted = {
    external_id: order._id,
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
      files: [{ url: product.vendorProduct.designId.designImages[2].imageUrl }],
    })),
  };

  const printfulOrderResponse = await printfulOrder(printfulDataFormatted);

  printfulOrderResponse.id = `MP-${printfulOrderResponse.id}`;

  if (printfulOrderResponse.code === 400) {
    throw new Error(printfulOrderResponse.message);
  }
  order.printfulOrderMetadata = printfulOrderResponse;
  await order.save();

  const profit = await calculateProfit(order, printfulOrderResponse.costs);
  // console.log({ profit });
  const ascrow = await Escrow.create({
    vendorId: order.vendorId,
    orderId: order._id,
    totalProfit: profit,
    vendorProfit: Number(profit * VENDOR_PROFIT_MARGIN.toFixed(2)),
    merchpalsProfit: Number(profit * MERCHPALS_PROFIT_MARGIN.toFixed(2)),
    releaseDate: moment().add(7, 'days'),
    status: PENDING,
  });

  return payment;
};
module.exports = mongoose.model('payment', paymentSchema);
