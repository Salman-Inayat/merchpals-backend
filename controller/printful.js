const axios = require('axios');
const { priceCalculation } = require('../services/printful');
const Order = require('../models/order');

const calculatePrice = async (req, res) => {
  try {
    const data = req.body.data;
    const pricingResponse = await priceCalculation(data);
    if (pricingResponse.code === 400) {
      throw new Error(pricingResponse.message);
    }

    const payload = {
      ...pricingResponse,
    };
    res.status(200).json({ payload });
  } catch (error) {
    console.log('calculatePrice func', error, error.result);
    res.status(400).json({ message: error.message });
  }
};

const orderUpdate = async (req, res) => {
  try {
    const data = req.body.data;
    await Order.shipped(req.body.type, data.order.external_id);

    res.status(200).json({ message: 'Order updated' });
  } catch (error) {
    console.log('orderUpdate func', error, error.result);
    res.status(400).json({ message: error.message });
  }
};
module.exports = {
  calculatePrice,
  orderUpdate,
};
