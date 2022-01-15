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
    const price = dbProduct.price;

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
    vendorProductIds: vendorProducts,
    name: data.design.name,
    url: data.design.imageUrl,
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

storeSchema.statics.createDesign = async function (data, vendorId) {
  let allProductsMappings = [];
  let formattedVendorProducts = [];

  const designId = mongoose.Types.ObjectId();
  const store = await this.findOne({ vendorId });

  const productIds = data.products.map(p => p.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  data.products.forEach(product => {
    const dbProduct = products.find(p => p._id.equals(product.productId));
    const price = dbProduct.price;

    allProductsMappings.push(...product.productMappings);
    formattedVendorProducts.push({
      productId: product.productId,
      designId,
      storeId: store._id,
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
    vendorProductIds: vendorProducts,
    name: data.design.name,
    url: data.design.imageUrl,
    canvasJson: data.design.canvasJson,
    storeId: store,
  });

  store.vendorProductIds = [...store.vendorProductIds, ...vendorProducts];
  store.designs = [...store.designs, newDesign];

  await store.save();

  return newDesign;
};

storeSchema.statics.getDesigns = async function (vendorId) {
  const store = await this.findOne({ vendorId }).populate({
    path: 'designs',
    select: 'name url',
  });
  return store.designs;
};

storeSchema.statics.getSingleDesign = async function (designId) {
  const design = await Design.findOne({ _id: designId }, 'name url canvasJson');

  return design;
};

storeSchema.statics.getSingleDesignProducts = async function (designId) {
  const design = await Design.findOne({ _id: designId })
    .populate({
      path: 'vendorProductIds',
      select: 'designId productId productMappings price',
      populate: [
        { path: 'designId', select: 'name url' },
        { path: 'productId', select: 'name image slug' },
        { path: 'productMappings' },
      ],
    })
    .lean();

  design.vendorProductIds = labelledProductMappings(design.vendorProductIds);
  return design;
};

storeSchema.statics.updateDesign = async function (designId, vendorId, data) {
  console.log({ data });
  console.log({ designId, vendorId, data });
  const store = await this.findOne({ vendorId });
  const previousVendorProducts = await VendorProduct.find({
    designId,
    storeId: store,
  });
  console.log({ previousVendorProducts });
  store.vendorProductIds = store.vendorProductIds.filter(
    vpId => !previousVendorProducts.some(p => p._id.equals(vpId)),
  );

  await VendorProduct.find({
    _id: { $in: previousVendorProducts },
  });

  let allProductsMappings = [];
  let formattedVendorProducts = [];

  const productIds = data.updatedProducts.map(p => p.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  data.updatedProducts.forEach(product => {
    let price = 0;
    const updatedProduct = data.vendorUpdatedPrices[product.productId];
    if (updatedProduct) {
      price = updatedProduct.price;
    } else {
      const dbProduct = products.find(p => p._id.equals(product.productId));
      price = dbProduct.minPrice;
    }

    allProductsMappings.push(...product.productMappings);
    formattedVendorProducts.push({
      productId: product.productId,
      designId,
      storeId: store._id,
      productMappings: product.productMappings,
      price,
    });
  });

  const vendorProducts = await VendorProduct.insertMany(
    formattedVendorProducts,
  );

  const updatedDesign = await Design.updateOne(
    { _id: designId },
    {
      vendorProductIds: vendorProducts,
    },
  );

  store.vendorProductIds = [...store.vendorProductIds, ...vendorProducts];

  await store.save();

  return updatedDesign;
};
module.exports = mongoose.model('store', storeSchema);
