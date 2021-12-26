const mongoose = required('mongoosse');

const vendorProducts = new mongoose.Schema({
  productId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'product'
  },
  designId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'design'
  },
  colors: {
    type: [Strings],
    default: []
  },
  sizes: {
    type: [Strings],
    default: [],
  }
}, { timestamps: true });

module.exports = mongoose.model('vendorProducts', vendorProducts);