const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * @field url
 * @description: Design Image's URL
 */

const designSchema = new mongoose.Schema({
  vendorId: {
    type: ObjectId,
    ref: 'vendor',
    required: true,
  },
  productId: {
    type: ObjectId,
    ref: 'product',
    required: true,
  },
  storeId: {
    type: ObjectId,
    ref: 'store',
    required: true,
  },  
  name: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('design', designSchema);