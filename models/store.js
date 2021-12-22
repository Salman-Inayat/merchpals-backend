const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
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
    ref: 'Product',
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Store', storeSchema);