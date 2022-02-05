const mongoose = require('mongoose');
const { SUCCEEDED, FAILED, PENDING } = require('../constants/statuses');
const stripe = require('stripe')(process.env.STRIPE_SECRET_CUSTOMER_KEY);
const ObjectId = mongoose.Schema.Types.ObjectId;

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

paymentSchema.statics.createAndChargeCustomer = async function (paymentInfo, order, customerId) {
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

  return payment;
};
module.exports = mongoose.model('payment', paymentSchema)
