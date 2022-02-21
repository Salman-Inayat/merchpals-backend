const mongoose = require('mongoose');
const Order = require('../models/order');
const Customer = require('../models/customer');
const Payment = require('../models/payment');
const sendEmail = require('../utils/email');
const { DELETED } = require('../constants/statuses');
const design = require('../models/design');
const { productsSlug } = require('../constants/productMappings');
const axios = require('axios');
const PRINTFUL_API = 'https://api.printful.com';

const SendOrderEmail = async (orderId, req) => {
  const data = await Order.getOrderById(orderId);

  let product = [],
    totalProducts = data.price,
    totalAmount = data.totalAmount;

  console.log('order fetched data', data);
  data.products.forEach(productitem => {
    product.push({
      productImg: productitem.vendorProduct.productId.image,
      designImg: productitem.vendorProduct.designId.designImages[4].imageUrl,
      productQuantity: productitem.quantity,
      productColor: productitem.productMapping.color.label,
      productName: productitem.vendorProduct.productId.name,
      productSlug: productitem.vendorProduct.productId.slug,
      productTotalAmount: (productitem.quantity * productitem.vendorProduct.price).toFixed(2),
      productSize: productitem.productMapping.variant.label,
    });
  });
  //TODO: we need to change orderId direction when we fix the orderId place

  const replacements = {
    orderId: data.printfulOrderMetadata.id,
    customerFirstName: data.customer.firstName,
    customerLastName: data.customer.lastName,
    address: data.billingAddress.street,
    orderDate: data.createdAt.slice(0, 10).replace(/-/g, '/'),
    totalProducts: totalProducts,
    orderCost: data.tax,
    totalShipping: data.shippingCost,
    totalOrder: totalAmount,
    products: product,
    tickImg: req.get('origin') + '/assets/img/tick.png',
    faqUrl: req.get('origin') + '/faq',
  };

  // console.log('replacements', replacements);
  return data;
};

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
    console.log('order', order);
    await Payment.createAndChargeCustomer(req.body.payment, order, recordId, req.body.printfulData);
    const data = await SendOrderEmail(order._id, req);

    await sendEmail({
      email: req.body.customer.email,
      subject: 'order sent',
      template: 'orderCreate',
      replacements: data,
      // text: 'rehman ali text',
    });

    res.status(200).json({ order, data, message: 'Order created successfully' });
  } catch (error) {
    await Order.findByIdAndUpdate(orderId, { $set: { status: DELETED } });
    await Payment.findByIdAndRemove(paymentId);

    console.log('create order controller', error);
    res.status(400).json({ message: error.message });
  }
};

const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      'printfulOrderMetadata.id': req.body.orderNo,
    });
    if (!order) {
      throw new Error('Order not found');
    }

    const orderNo = req.body.orderNo;
    const printfulOrderId = parseInt(orderNo.slice(3));

    const response = await axios.get(`${PRINTFUL_API}/orders/${printfulOrderId}`, {
      headers: {
        authorization: `Basic ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    const data = {
      orderNo,
      status: order.status,
      trackingNumber: response.data.result?.shipments[0]?.tracking_number,
      trackingUrl: response.data.result?.shipments[0]?.tracking_url,
      carrier: response.data.result?.shipments[0]?.carrier,
    };

    res.status(200).json({ data, message: 'Order tracked successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  trackOrder,
};
