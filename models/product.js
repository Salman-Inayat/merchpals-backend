const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  isDefault: {
    type: Boolean,
    default: false,
    required: true,
  },
  sizes: {
    type: [String],
    enum: ['extra_small','small', 'medium', 'large', 'extra_large']
  },
  colors: {
    type: [String],
    enum: ['blue', 'green', 'black']
  },
  price: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);