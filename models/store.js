const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const storeSchema = new mongoose.Schema({
  vendorId: {
    type: ObjectId,
    required: true,
  },
  products: {
    type: [ObjectId],
    ref: 'product',
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
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('store', storeSchema);