const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
/**
 * 
 * @field createdBy
 * @description This field is required only for vendor's defined product
 * but in case of default products i.e. where @field isDefault: true, @createdBy field
 * will be null
 * @reference vendor table -> _id
 * 
 * @field productNumberedId
 * @description Like _id field this product will be unique to all products & more human readable 
 * these readable Ids are defined in code and can never be changed
 * 
 * @field slug
 * @description same as productNumberedId just string based ids
 * 
 * @field isDefault
 * @description This field differentiate between platforms defined & vendor defined products
 * 
 * @field variants
 * @description 
 * 
 * @field colors
 * @description 
 * 
 * @field basePrice
 * @description
 * 
 * @field costPrice
 * @description
 * 
 * @field minPrice
 * @description
 * 
 * @field shippingCost
 * @description
 * 
 * @field background
 * @description
 * 
 */
const productSchema = new mongoose.Schema({
  createdBy: {
    type: ObjectId,
    ref: 'vendor'
  },  
  name: {
    type: String,
    required: true,
    trim: true,
  },
  productNumberedId: {
    type: Number,
    enum: [],//TODO: need to update values here
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: false,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    enum: [], //TODO: need to update values here
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  variants: {
    type: [String]
  },
  colors: {
    type: [String]
  },
  basePrice: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true,
  },
  minPrice: {
    type: Number,
  },
  shippingCost: {
    type: Number
  },
  background: {
   type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('product', productSchema);