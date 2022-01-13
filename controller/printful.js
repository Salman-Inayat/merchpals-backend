const axios = require('axios');
const {
  printfulTax,
  printfulShipping
} = require('../services/printful');

const calculateTax = async (req, res) => {
  try {
    const data = req.body.data;
    const taxResponse = await printfulTax(data);

    const payload = {
      rate: taxResponse.rate,
      shippingTaxable: taxResponse.shipping_taxable
    }
    res.status(200).json({ payload })
  } catch (error) {
    console.log('calculateTax func', error, error.result);
    res.status(400).json({ message: error.result });
  }
}

const calculateShipping = async (req, res) => {
  try {
      const data = req.body.data;
      const shippingResponse = await printfulShipping(data);
      const payload = {
        ...shippingResponse
      }
      res.status(200).json({ payload })
    } catch (error) {
      console.log('calculateShipping func', error, error.result);
      res.status(400).json({ message: error.result });
    }
}

module.exports = {
  calculateTax,
  calculateShipping
}
