const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Design = require("./design");
const VendorProducts = require("./vendorProduct");
const Vendor = require("./vendor");
const labelledSingleProduct = require("../utils/labelledSingleProduct");
const labelledProductMappings = require("../utils/variantMappings");
const Product = require('./product');

const storeSchema = new mongoose.Schema({
  vendorId: {
    type: ObjectId,
    ref: 'vendor',
    required: true,
  },
  products: {
    type: [ObjectId],
    ref: 'product',
  },
  designs: {
    type: [ObjectId],
    ref: 'design'
  },
  productMappings: {
    type: [ObjectId],
    ref: 'productMapping',
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
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  },
  socialHandles: {
    tiktok: '',
    instagram: '',
    youtube: '',
    tiktok: '',
  },
}, { timestamps: true });

storeSchema.statics.createStoreAndEssence = async function (userData, data) {
  const slugExists = await this.findOne({slug: decodeURI(data.slug)});

  if (slugExists) {
    throw new Error('Slug already taken')
  }

  const vendorId = await Vendor.findOne({userId: userData._id})
  let allProductsMappings = [];
  let formattedVendorProducts = [];
  // console.log({ data });
  data.products.forEach((product) => {
    allProductsMappings.push(...product.productMappings);
  })

  const store = await this.create({
    name: data.name,
    vendorId: vendorId,
    logo: data.logo,
    socialHandles: {
      youtube: data.youtube,
      twtich: data.twtich,
      instagram: data.instagram,
      tiktok: data.tiktok
    },
    slug: data.slug,
    coverAvatar: data.coverAvatar,
    productMappings: allProductsMappings,
    products: data.products.map(p => p.productId)
  });

  const newDesign = await Design.create({
    vendorId: vendorId, 
    productMappings: allProductsMappings,
    name: `${+new Date()}`, 
    url: data.designs,
    storeId: store
  });

  store.designs = [newDesign];
  await store.save();
  
  const productIds = data.products.map(p => p.productId);
  const products = await Product.find({ _id: { $in: productIds } })

  data.products.forEach((product) => {
    const dbProduct = products.find(p => p._id.equals(product.productId))
    const price = dbProduct.basePrice + dbProduct.shippingCost;

    formattedVendorProducts.push({
      productId: product.productId, designId: newDesign, storeId: store, productMappings: product.productMappings, price
    })
  })
  
  // console.log({formattedVendorProducts});
  await VendorProducts.insertMany(formattedVendorProducts)
  
  const formattedStore = store
    .populate(['vendorId', 'designs', 'productMappings']);

  return formattedStore;
}

storeSchema.statics.getLabeledInfo = async function (userId) {
  let vendor = await Vendor.findOne({ userId })
  let store = await this.findOne({vendorId: vendor})
    .populate([
      { path: 'vendorId', select: 'displayName email phoneNumber avatar' }, 
      { path: 'designs', select: 'name url' },
      { path: 'products', select: 'name image slug' },
      { 
        path: 'productMappings', 
        select: 'productId keyId variantId productNumberedId color variant',
      }
    ])
    .lean();

    const formattedProducts = store.products.map(product => {
      const relatedMapping = store.productMappings.filter(pm => pm.productId.equals(product._id))
      return { ...product, productMappings: relatedMapping }
    })
    // console.log({ formattedProducts });
    store.products = labelledProductMappings(formattedProducts)
    delete store.productMappings;
  return store;
}

storeSchema.statics.getLabeledInfoBySlug = async function (slug) {
  let store = await this.findOne({ slug })
    .populate([
      { path: 'vendorId', select: 'displayName email phoneNumber avatar' }, 
      { path: 'designs', select: 'name url' },
      { path: 'products', select: 'name image slug' },
      { 
        path: 'productMappings', 
        select: 'productId keyId variantId productNumberedId color variant',
      }
    ])
    .lean();

    const formattedProducts = store.products.map(product => {
      const relatedMapping = store.productMappings.filter(pm => pm.productId.equals(product._id))
      return { ...product, productMappings: relatedMapping }
    })
    
    store.products = labelledProductMappings(formattedProducts)
    delete store.productMappings;
  return store;
}

storeSchema.statics.getStoreProductInfo = async function (storeSlug, productId) {
  // console.log({storeSlug, productId});
  const store = await this.findOne({ slug: storeSlug });
  const productDetail = await VendorProducts.findOne({
    storeId: store,
    productId
  })
  .populate([
    { path: 'designId', select: 'name url' },
    { path: 'productId', select: 'name image slug' },
    { 
      path: 'productMappings', 
      select: 'productId keyId variantId productNumberedId color variant',
    }
  ]).lean();
  let formattedProduct = {
    ...productDetail,
    ...productDetail.productId,
  }

  delete formattedProduct.productId;
  const formattedMappings = labelledSingleProduct(formattedProduct)
console.log(formattedMappings);
  return formattedMappings;
}
module.exports = mongoose.model('store', storeSchema);