const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Design = require("./design");
const VendorProducts = require("./vendorProduct");
const Vendor = require("./vendor");
const labelledProductMappings = require("../utils/variantMappings");

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
  }
}, { timestamps: true });

storeSchema.statics.createStoreAndEssence = async function (userData, data) {
  console.log({user: userData});

  const slugExists = await this.findOne({slug: decodeURI(data.slug)});

  if (slugExists) {
    throw new Error('Slug already taken')
  }

  const vendorId = await Vendor.findOne({userId: userData._id})
  let allProductsMappings = [];
  let formattedVendorProducts = [];
console.log({vendorId});
  data.products.forEach((product) => {
    allProductsMappings.push(...product.productMappings);
  })

  console.log({ allProductsMappings });

  const store = await this.create({
    name: data.name,
    vendorId: vendorId,
    logo: data.logo,
    slug: data.slug,
    coverAvatar: data.coverAvatar,
    productMappings: allProductsMappings,
    products: data.products.map(p => p.productId)
  });

  const newDesign = await Design.create({
    vendorId: vendorId, 
    productMappings: allProductsMappings,
    name: data.designs[0].name, 
    url: data.designs[0].url,
    storeId: store
  });

  store.designs = [newDesign];
  await store.save();

  data.products.forEach((product) => {
    formattedVendorProducts.push({
      productId: product.productId, designId: newDesign, storeId: store, productMappings: product.productMappings
    })
  })

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

module.exports = mongoose.model('store', storeSchema);