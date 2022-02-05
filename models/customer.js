const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * @field orderHistory 
 * @description Array of ObjectIds of all the orders a customer has ever placed
 * @reference order table -> _id
 */
const customerSchema = new mongoose.Schema(
  {
    orderHistory: {
      type: [ObjectId],
      ref: 'order',
    },
    record: [
      {
        firstName: {
          type: String,
          trim: true,
          required: true,
        },
        lastName: {
          type: String,
          trim: true,
          required: true,
        },
        phoneNo: {
          type: String,
          trim: true,
          required: true,
        },
        email: {
          type: String,
          trim: true,
          required: true,
        },
      },
    ],
    phoneNo: {
      type: [String],
      required: true,
    },
    email: {
      type: [String],
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true },
);

customerSchema.statics.createCustomer = async function (customerInfo, orderId, recordId) {
  let customer = await this.findOne({
    phoneNo: { $in: [customerInfo.phoneNo] },
  });

  if (!customer) {
    customer = await this.findOne({
      email: { $in: [customerInfo.email] },
    });
  }

  if (!customer) {
    customer = new this();
    customer.record.push({ ...customerInfo, _id: recordId });
  } else {
    customer.record = [...customer.record, { ...customerInfo, _id: recordId }];
  }

  const hasPhone = customer.phoneNo.find(p => p === customerInfo.phoneNo);
  if (!hasPhone) {
    customer.phoneNo = [...new Set([...customer.phoneNo, customerInfo.phoneNo])];
  }

  const hasEmail = customer.email.find(e => e === customerInfo.email);
  if (!hasEmail) {
    customer.email = [...new Set([...customer.email, customerInfo.email])];
  }

  customer.orderHistory = [...customer.orderHistory, orderId];
  await customer.save();
  return customer;
};

module.exports = mongoose.model('customer', customerSchema);