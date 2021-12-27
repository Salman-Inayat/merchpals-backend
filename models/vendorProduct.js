const mongoose = required('mongoosse');
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * 
 * Model Description
 * #################
 * This model contains all the products & their variants which vendor has selected
 * to display on his / her store.
 * 
 * @field colors
 * @description
 * 
 * @field variants
 * @description This field has also different values depending upon the product
 * for all associated values linked with specific products are listed in (const / files ref)
 */
const vendorProducts = new mongoose.Schema({
  productId: {
    type: ObjectId,
    required: true,
    ref: 'product'
  },
  designId: {
    type: ObjectId,
    required: true,
    ref: 'design'
  },
  colors: {
    type: [Strings],
    default: []
  },
  variants: {
    type: [Strings],
    default: [],
  }
}, { timestamps: true });

module.exports = mongoose.model('vendorProducts', vendorProducts);