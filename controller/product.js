const Product = require('../models/product');

const addProducts = async (req, res) => {
  try {
    const product = await Product.createProductAndMappings(req.body);
    res.status(200).json({ product, message: 'Product created successfully' });
  } catch (error) {
    console.log('addProducts', error.message);
    res.status(400).json({ message: error.message });
  }
};

const fetchProducts =  async (req, res) => {
  try {
    const products = await Product.getLabeledInfo();
    res.status(200).json({ products });
  } catch (error) {
    console.log('fetchProducts', error.message);
    res.status(400).json({ message: error.message });
  }
}; 

module.exports = {
  addProducts,
  fetchProducts
}