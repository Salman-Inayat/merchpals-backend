const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  vendorId: {
    type: mongoose.Types.ObjectId,
    ref: 'Vendor',
    required: true,
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  storeId: {
    type: mongoose.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Design', designSchema);