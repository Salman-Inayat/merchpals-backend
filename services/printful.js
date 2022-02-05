const axios = require('axios');
const PRINTFUL_API = 'https://api.printful.com';
const { calculateAmount } = require('./calculateAmount');

const printfulTax = async data => {
  try {
    const country = data.recipient.country_code;
    const regionResponse = await axios.get(`https://restcountries.com/v3.1/alpha/${country}`);

    if (regionResponse.data[0].region === 'Europe') {
      return {
        rate: 0.2,
        shipping_taxable: true,
      };
    }

    if (country === 'CA') {
      return {
        rate: 0.15,
        shipping_taxable: true,
      };
    }

    const res = await axios.post(`${PRINTFUL_API}/tax/rates`, data, {
      headers: {
        authorization: `Basic ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    return res.data.result;
  } catch (e) {
    return {
      code: e.response.data.code,
      message: e.response.data.result,
    };
  }
};

const printfulShipping = async data => {
  try {
    if (data.recipient.country_code === 'US') {
      return {
        rate: 'FREE',
        shipping_taxable: false,
      };
    }

    const res = await axios.post(`${PRINTFUL_API}/shipping/rates`, data, {
      headers: {
        authorization: `Basic ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    return res.data.result[0];
  } catch (e) {
    return {
      code: e.response.data.code,
      message: e.response.data.result,
    };
  }
};

const printfulOrder = async data => {
  try {
    const res = await axios.post(`${PRINTFUL_API}/orders`, data, {
      headers: {
        authorization: `Basic ${process.env.PRINTFUL_API_KEY}`,
      },
    });

    return res.data.result;
  } catch (e) {
    return {
      code: e.response.data.code,
      message: e.response.data.result,
    };
  }
};

const priceCalculation = async data => {
  try {
    let taxAmount = 0;
    let shippingAmount = 0;
    let orderActualAmount = 0;
    let amountWithTaxAndShipping = 0;

    /**
     * Keep the printfulTax call as the first to execute
     * because it will validate data plus country & state as well
     */

    const taxResponse = await printfulTax(data);

    if (taxResponse.code === 400) {
      throw new Error(taxResponse.message);
    }

    const shippingResponse = await printfulShipping(data);
    orderActualAmount = await calculateAmount(data.items);
    taxAmount = Number((orderActualAmount * Number(taxResponse.rate)).toFixed(2));
    amountWithTaxAndShipping = Number((orderActualAmount + shippingAmount + taxAmount).toFixed(2));

    return {
      taxRate: taxResponse.rate,
      shippingAmount: shippingResponse.rate,
      taxAmount,
      orderActualAmount,
      amountWithTaxAndShipping,
    };
  } catch (e) {
    return {
      code: 400,
      message: e.message,
    };
  }
};

module.exports = {
  printfulOrder,
  priceCalculation,
};
