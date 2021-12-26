const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  vendorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  coverAvatar: {
    type: String,
  },
  logo: {
    type: String
  },
  theme: {
    type: String
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  products: {
    type: [mongoose.Types.ObjectId],
    ref: 'product',
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('store', storeSchema);