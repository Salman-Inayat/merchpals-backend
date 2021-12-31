const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Design = require("./design");
const VendorProducts = require("./vendorProduct");
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
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  }
}, { timestamps: true });

storeSchema.statics.createStoreAndEssence = async function (data) {
  console.log({data});
  let allProductsMappings = [];
  let formattedVendorProducts = [];

  data.products.forEach((product) => {
    allProductsMappings.push(...product.productMappings);
  })

  console.log({ allProductsMappings });

  const store = await this.create({
    name: data.name,
    vendorId: data.vendorId,
    logo: data.logo,
    coverAvatar: data.coverAvatar,
    productMappings: allProductsMappings,
    products: data.products.map(p => p.productId)
  });

  const newDesign = await Design.create({
    vendorId: data.vendorId, 
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

storeSchema.statics.getLabeledInfo = async function (storeId) {
  let store = await this.findOne({_id: storeId})
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