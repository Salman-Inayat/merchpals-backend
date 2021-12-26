const mongoose = require('mongoose');

const designSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  vendorId: {
    type: mongoose.Types.ObjectId,
    ref: 'vendor',
    required: true,
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'product',
    required: true,
  },
  storeId: {
    type: mongoose.Types.ObjectId,
    ref: 'store',
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('design', designSchema);