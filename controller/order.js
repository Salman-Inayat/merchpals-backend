const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Payment = require('../models/payment');
const MerchantOrder = require('../models/merchantOrder');

const createOrder = async(req, res) => {
  try {
    const orderId = mongoose.Types.ObjectId();
    const paymentId = mongoose.Types.ObjectId();
    const merchantOrderId = mongoose.Types.ObjectId();
    
    //console.log({orderId, merchantOrderId, paymentId});
    // const customer = await Customer.createCustomer(req.body.customer, orderId);  
    // console.log({ customer });
    // const order = await Order.createOrder(req.body.order, orderId, merchantOrderId, customer._id, paymentId);
    // console.log({order});
    // const payment = await Payment.createAndChargeCustomer(req.body.payment, order.totalAmount, customer._id, orderId, paymentId)
    
    const merchantOrder = await MerchantOrder.createOrder(order, req.body.printfulData, merchantOrderId);
    res.status(200).json({ order, message: 'Order created successfully'})
  } catch (error) {
    console.log('create order controller', error);
    res.status(400).json({ message: error.message });    
  }
}

module.exports = {
  createOrder
}