const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Design = require('./design');
const VendorProduct = require('./vendorProduct');
const Vendor = require('./vendor');
const labelledSingleProduct = require('../utils/labelledSingleProduct');
const labelledProductMappings = require('../utils/variantMappings');
const Product = require('./product');

const storeSchema = new mongoose.Schema(
  {
    vendorId: {
      type: ObjectId,
      ref: 'vendor',
      required: true,
    },
    vendorProductIds: {
      type: [ObjectId],
      ref: 'vendorProducts',
    },
    designs: {
      type: [ObjectId],
      ref: 'design',
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
      type: String,
    },
    theme: {
      type: String,
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
      default: 'active',
    },
    socialHandles: {
      tiktok: '',
      instagram: '',
      youtube: '',
      twitch: '',
    },
  },
  { timestamps: true },
);

storeSchema.statics.createStoreAndEssence = async function (userData, data) {
  const slug = data.name
    .replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
    .toLowerCase()
    .split(' ')
    .join('-');

  const slugExists = await this.findOne({ slug });

  if (slugExists) {
    throw new Error('Slug already taken');
  }

  const storeId = mongoose.Types.ObjectId();
  const designId = mongoose.Types.ObjectId();

  const vendorId = await Vendor.findOne({ userId: userData._id });
  let allProductsMappings = [];
  let formattedVendorProducts = [];

  data.products.forEach(product => {
    allProductsMappings.push(...product.productMappings);
  });

  const productIds = data.products.map(p => p.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  data.products.forEach(product => {
    const dbProduct = products.find(p => p._id.equals(product.productId));
    const price = dbProduct.minPrice;

    formattedVendorProducts.push({
      productId: product.productId,
      designId,
      storeId,
      productMappings: product.productMappings,
      price,
    });
  });

  const vendorProducts = await VendorProduct.insertMany(
    formattedVendorProducts,
  );

  const newDesign = await Design.create({
    _id: designId,
    vendorId,
    productMappings: allProductsMappings,
    name: `${+new Date()}`,
    url: data.designs,
    storeId,
  });

  const store = await this.create({
    _id: storeId,
    name: data.name,
    vendorId,
    designs: [designId],
    logo: data.logo,
    socialHandles: {
      youtube: data.youtube,
      twitch: data.twitch,
      instagram: data.instagram,
      tiktok: data.tiktok,
    },
    slug,
    coverAvatar: data.coverAvatar,
    productMappings: allProductsMappings,
    vendorProductIds: vendorProducts.map(p => p._id),
  });

  const formattedStore = store.populate([
    'vendorId',
    'designs',
    'productMappings',
  ]);

  return formattedStore;
};

storeSchema.statics.getLabeledInfo = async function (userId) {
  let vendor = await Vendor.findOne({ userId });
  let store = await this.findOne({ vendorId: vendor })
    .populate([
      { path: 'vendorId', select: 'displayName email phoneNumber avatar' },
      {
        path: 'vendorProductIds',
        select: 'designId productId productMappings',
        populate: [
          { path: 'designId', select: 'name url' },
          { path: 'productId', select: 'name image slug' },
          { path: 'productMappings' },
        ],
      },
    ])
    .lean();

  store.vendorProductIds = labelledProductMappings(store.vendorProductIds);
  delete store.productMappings;
  return store;
};

storeSchema.statics.getLabeledInfoBySlug = async function (slug) {
  let store = await this.findOne({ slug })
    .populate([
      { path: 'vendorId', select: 'displayName email phoneNumber avatar' },
      {
        path: 'vendorProductIds',
        select: 'designId productId productMappings',
        populate: [
          { path: 'designId', select: 'name url' },
          { path: 'productId', select: 'name image slug' },
          { path: 'productMappings' },
        ],
      },
    ])
    .lean();

  store.vendorProductIds = labelledProductMappings(store.vendorProductIds);
  delete store.productMappings;
  return store;
};

storeSchema.statics.getStoreProductInfo = async function (
  storeSlug,
  productId,
) {
  // console.log({storeSlug, productId});
  const store = await this.findOne({ slug: storeSlug });
  const productDetail = await VendorProduct.findOne({
    storeId: store,
    productId,
  })
    .populate([
      { path: 'designId', select: 'name url' },
      { path: 'productId', select: 'name image slug' },
      {
        path: 'productMappings',
        select: 'productId keyId variantId productNumberedId color variant',
      },
    ])
    .lean();
  let formattedProduct = {
    ...productDetail,
    ...productDetail.productId,
  };
  console.log({ productDetail });
  delete formattedProduct.productId;
  const formattedMappings = labelledSingleProduct(formattedProduct);
  console.log(formattedMappings);
  return formattedMappings;
};
module.exports = mongoose.model('store', storeSchema);
