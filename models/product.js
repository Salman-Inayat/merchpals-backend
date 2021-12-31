const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const { 
  productsSlug,
  productsConfig
} = require('../constants/productMappings');
const ProductMapping = require('./productMapping');
const labelledProductMappings = require("../utils/colorMapping");

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
  productMappings: {
    type: [ObjectId],
    ref: 'productMapping'
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  productNumberedId: {
    type: Number,
    required: true,
    unique: true,
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
    enum: productsSlug,
    required: true,
    unique: true,
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

productSchema.statics.getProductWithMappingsLabeled = async function (productId) {
  const product = await this.findOne(productId);
  const productConfig = productsConfig[product.slug];

  const mappedVariants = product.variants.map(v => {
    const configVariant = productConfig.variant[v]
    if(!configVariant){
      throw new Error(`Invalid variant value: ${v}`)
    }
    return configVariant;
  })

  const mappedColors = product.colors.map(v => {
    const configColor = productConfig.color[v]
    if(!configColor){
      throw new Error(`Invalid color value: ${v}`)
    }
    return configColor;
  })

  product.variants = mappedVariants;
  product.colors = mappedColors;

  const productMappings = await ProductMapping.find({ productId: product._id})
};

productSchema.statics.createProductAndMappings = async function (data) {
  const slug = productsSlug.find(p => p === data.slug.toLowerCase());

  if (!slug) {
    throw new Error('Slug is not valid')
  }
  
  const productConfig = productsConfig[slug];
  data.productNumberedId = productConfig.id;
  data.slug = slug;

  const mappedVariants = data.variants.map(v => {
    const variantObj = productConfig.variant;
    const configVariant = Object.keys(variantObj).find(pcv => variantObj[pcv] === v)
    if(!configVariant){
      throw new Error(`Invalid variant value: ${v}`)
    }
    return configVariant;
  })

  const mappedColors = data.colors.map(v => {
    const colorObj = productConfig.color;
    const configColor = Object.keys(colorObj).find(pcv => colorObj[pcv] === v)
    if(!configColor){
      throw new Error(`Invalid color value: ${v}`)
    }
    return configColor;
  })

  data.variants = mappedVariants;
  data.colors = mappedColors.length > 0 ? mappedColors : ['0'];

  const product = await this.create({...data});
  let productVariantMapping = [];

  for (const variant of product.variants) {
    for (const color of product.colors) {
      productVariantMapping.push({
        productId: product._id,
        productNumberedId: product.productNumberedId,
        variant: variant,
        color: color,
        keyId: `${product.productNumberedId}-${variant}-${color}`,
      });
    }
  }

  const productMappings = await ProductMapping.insertMany(productVariantMapping)
  product.productMappings = productMappings;
  await product.save();

  const productWithMappings = await this.findOne(product._id)
    .populate('productMappings')

  return productWithMappings;
};

productSchema.statics.getLabeledInfo = async function () {
  const products = await this.find({}).lean()
  
  const formattedProducts = labelledProductMappings(products)

  return formattedProducts;
}

module.exports = mongoose.model('product', productSchema);