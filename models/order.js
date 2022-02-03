const mongoose = require('mongoose');
const VendorProduct = require('./vendorProduct');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Store = require('./store');
const { printfulTax, printfulShipping } = require('../services/printful');
const { mapColor } = require('../utils/colorAndVariantMappingForOrder');
/**
 *
 * @field size
 * @field shippingCose
 * @field tax
 * @field totalAmount
 *
 */
const orderSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          vendorProduct: {
            type: ObjectId,
            ref: 'vendorProducts',
            required: true,
          },
          productMapping: {
            type: ObjectId,
            ref: 'productMapping',
            required: true,
          },
          quantity: {
            type: Number,
            required: true
          }
        }
      ],
    },
    vendorId: {
      type: ObjectId,
      required: true,
    },
    storeId: {
      type: ObjectId,
      required: true,
      ref: 'store',
    },
    customerId: {
      type: ObjectId,
      required: true,
      ref: 'customer',
    },
    merchantOrderId: {
      type: ObjectId,
      required: true,
    },
    paymentId: {
      type: ObjectId,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
      default: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    billingAddress: {
      aptNo: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      zip: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true },
);

orderSchema.statics.createOrder = async function (
  data,
  orderId,
  merchantOrderId,
  customerId,
  paymentId,
  printfulData,
) {
  let shippingCost = 0;
  if (data.billingAddress.country.toLowerCase() !== 'us') {
    const shippingResponse = await printfulShipping(printfulData);
    if (shippingResponse.code === 400) {
      throw new Error(shippingResponse.message);
    }
    shippingCost = shippingResponse.rate;
  }

  const taxResponse = await printfulTax(printfulData);
  if (taxResponse.code === 400) {
    throw new Error(taxResponse.message);
  }
  const taxRate = taxResponse.rate;
  const store = await Store.findOne({ slug: data.storeUrl }).select(
    '_id vendorId',
  );

  const subTotal = Number(data.amount.toFixed(2));
  const tax = Number((subTotal * taxRate).toFixed(2));

  let order = new this();
  order._id = orderId;
  order.merchantOrderId = merchantOrderId;
  order.customerId = customerId;
  order.paymentId = paymentId;
  order.storeId = store._id;
  order.vendorId = store.vendorId;
  order.products = data.products;
  order.price = subTotal;
  order.tax = tax;
  order.shippingCost = shippingCost;
  order.totalAmount = Number((subTotal + tax + Number(shippingCost)).toFixed(2));
  order.billingAddress = data.billingAddress;

  await order.save();
  const fullOrder = await this.findOne({ _id: order._id }).populate({path: 'products', populate: [
    {
      path: 'vendorProduct', 
      select: 'designId price',
      populate: { path: 'designId', select: 'url' } 
    }, 
    { path: 'productMapping' }
  ]})
  
  return fullOrder;
};

orderSchema.statics.getOrders = async function (vendorId) {
  let orders = await this.find({ vendorId })
    .populate([
      {
        path: 'customerId',
        select: 'firstName lastName email phoneNumber avatar',
      },
      {
        path: 'products',
        populate: [
          {
          path: 'vendorProduct',
          select: 'designId productId price',
          populate: [
            { path: 'designId', select: 'name url' },
            { path: 'productId', select: 'name image minPrice basePrice slug' },
          ],
        },
        {
          path: 'productMapping',
          select: 'color'
        }
      ]
      },
    ])
    .lean();

  return orders;
};

orderSchema.statics.getOrderById = async function (orderId) {
  let order = await this.findOne({ _id: orderId })
    .populate([
      {
        path: 'customerId',
        select: 'firstName lastName email phoneNumber avatar',
      },
      {
        path: 'products',
        populate: [
          {
          path: 'vendorProduct',
          select: 'designId productId price',
          populate: [
            { path: 'designId', select: 'name url' },
            { path: 'productId', select: 'name image minPrice basePrice slug' },
          ],
        },
        {
          path: 'productMapping',
        }
      ]
      },
    ])
    .lean();
  
  const mappedOrder = mapColor(JSON.parse(JSON.stringify(order)))
  return mappedOrder;
};

module.exports = mongoose.model('order', orderSchema);
