const axios = require('axios');
const PRINTFUL_API = 'https://api.printful.com';

const printfulTax = async (data) => {
  const res = await axios.post(`${PRINTFUL_API}/tax/rates`, data, {
    headers: {
      authorization: `Basic ${process.env.PRINTFUL_API_KEY}`
    }
  })

  return res.data.result;
};

const printfulShipping = async (data) => {
  const res = await axios.post(`${PRINTFUL_API}/shipping/rates`, data, {
    headers: {
      authorization: `Basic ${process.env.PRINTFUL_API_KEY}`
    }
  })

  return res.data.result[0];
};

const printfulOrder = async (data) => {
  const res = await axios.post(`${PRINTFUL_API}/orders`, data, {
    headers: {
      authorization: `Basic ${process.env.PRINTFUL_API_KEY}`
    }
  })
  
  return res.data.result;
};

module.exports = {
  printfulTax,
  printfulShipping,
  printfulOrder
}
