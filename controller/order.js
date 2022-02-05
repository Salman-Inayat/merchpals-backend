const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Payment = require('../models/payment');
const MerchantOrder = require('../models/merchantOrder');
const sendEmail = require('../utils/email');
const { DELETED } = require('../constants/statuses');

const createOrder = async (req, res) => {
  const orderId = mongoose.Types.ObjectId();
  const paymentId = mongoose.Types.ObjectId();
  const merchantOrderId = mongoose.Types.ObjectId();
  const recordId = mongoose.Types.ObjectId();

  try {
    const customer = await Customer.createCustomer(req.body.customer, orderId, recordId);
    const order = await Order.createOrder(
      orderId,
      merchantOrderId,
      recordId,
      paymentId,
      req.body.printfulData,
      req.body.storeUrl,
    );

    const payment = await Payment.createAndChargeCustomer(req.body.payment, order, recordId);
    const merchantOrder = await MerchantOrder.createOrder(
      order,
      merchantOrderId,
      req.body.printfulData,
    );

    order.printfulOrderMetadata = merchantOrder;
    await order.save();

    await sendEmail({
      email: req.body.customer.email,
      subject: 'order sent',
      template: 'createOrder',
    });

    res.status(200).json({ order, merchantOrder, message: 'Order created successfully' });
  } catch (error) {
    await Order.findByIdAndUpdate(orderId, { $set: { status: DELETED } });
    await Payment.findByIdAndRemove(paymentId);
    await MerchantOrder.findByIdAndRemove(merchantOrderId);

    console.log('create order controller', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
};
