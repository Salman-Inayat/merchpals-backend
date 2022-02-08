const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Payment = require('../models/payment');
const sendEmail = require('../utils/email');
const { DELETED } = require('../constants/statuses');

const createOrder = async (req, res) => {
  const orderId = mongoose.Types.ObjectId();
  const paymentId = mongoose.Types.ObjectId();
  const recordId = mongoose.Types.ObjectId();

  try {
    await Customer.createCustomer(req.body.customer, orderId, recordId);
    const order = await Order.createOrder(
      orderId,
      recordId,
      paymentId,
      req.body.printfulData,
      req.body.storeUrl,
    );

    await Payment.createAndChargeCustomer(req.body.payment, order, recordId, req.body.printfulData);

    await sendEmail({
      email: req.body.customer.email,
      subject: 'order sent',
      template: 'orderCreate',
      replacements: { order: '1002323' },
    });

    res.status(200).json({ order, message: 'Order created successfully' });
  } catch (error) {
    await Order.findByIdAndUpdate(orderId, { $set: { status: DELETED } });
    await Payment.findByIdAndRemove(paymentId);

    console.log('create order controller', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
};
