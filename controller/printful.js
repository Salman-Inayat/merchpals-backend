const { PrintfulClient } = require("printful-request");
const printful = new PrintfulClient(process.env.PRINTFUL_API_KEY);

const calculateTax = async (req, res) => {
  try {
    const data = req.body.data;
    console.log({ data });
    const tax = await printful.post("tax/rates", data)
    console.log({tax});
    const payload = {
      rate: tax.result.rate,
      shippingTaxable: tax.result.shipping_taxable
    }
    res.status(200).json({ payload })
  } catch (error) {
    console.log('calculateTax func', error.status, error.result);
    res.status(400).json({ message: error.result });    
  }
}

const calculateShipping = async (req, res) => {
  try {
      const data = req.body.data;
      const shipping = await printful.post("shipping/rates", data)
      const payload = {
        cost: shipping.result[0].rate,
        estimatedTime: shipping.result[0].name
      }
      res.status(200).json({ payload })
    } catch (error) {
      console.log('calculateShipping func', error.status, error.result);
      res.status(400).json({ message: error.result });    
    }
}

module.exports = {
  calculateTax,
  calculateShipping
}