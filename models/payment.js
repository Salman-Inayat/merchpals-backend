const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * 
 * @field transactionId
 * @field customerId
 * @field stripeToken
 * @field totalAmount
 * 
 */

const SUCCEEDED = "succeeded";
const PENDING = "pending";
const FAILED = "failed";

const paymentSchema = new mongoose.Schema({
  transactionId: {
    type: ObjectId,
    ref: 'transaction',
  },
  customerId: {
    type: ObjectId,
    ref: 'customer',
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
    type: String
  },
  stripeChargeId: {
    type: String
  },
  // total amount paid via stripe
  amount: {
    type: Number,
    required: true,    
  },
  ccLast4Digits:{
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: [PENDING, SUCCEEDED, FAILED],
    default: PENDING
  }
},
{ timestamps: true })

paymentSchema.statics.createAndChargeCustomer = async function (paymentInfo, amount, customerId, orderId, paymentId){
  let payment = await this.create({
    _id: paymentId,
    customerId,
    orderId,
    amount,
    ccLast4Digits: paymentInfo.cardNumber.substr(paymentInfo.cardNumber.length - 4)
  })

  // console.log({ paymentBeforeStripe: payment });
  // console.log({stripeKey: process.env.STRIPE_SECRET_KEY});

  const token = await stripe.tokens.create({
    card: {
      number: paymentInfo.cardNumber,
      exp_month: paymentInfo.expiryMonth,
      exp_year: paymentInfo.expiryYear,
      cvc: paymentInfo.cvc,
    },
  });

  // console.log({ token });
  const charge = await stripe.charges.create({
    amount,
    currency: 'usd',
    source: token.id,
    description: `customer payment for order# ${orderId}`,
  });
  
  // console.log({stripeResponse: charge});

  if (charge.status === SUCCEEDED) {
    payment.status = SUCCEEDED;
    payment.stripeTokenId = token.id;
    payment.stripeChargeId = charge.id;
  } else {
    payment.status = charge.status;
    payment.stripeTokenId = token.id;
  }

  await payment.save()
  
  return payment;
}
module.exports = mongoose.model('payment', paymentSchema)