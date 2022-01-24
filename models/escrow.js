const mongoose = require('mongoose');
const { PENDING, RELEASED } = require('../constants/statuses');
const ObjectId = mongoose.Schema.Types.ObjectId;

const escrowSchema = new mongoose.Schema(
  {
    vendorId: {
      type: ObjectId,
      ref: 'vendor',
      required: true,
    },
    orderId: {
      type: ObjectId,
      ref: 'order',
      required: true,
    },
    totalProfit: Number,
    vendorProfit: Number,
    merchpalsProfit: Number,
    releaseDate: Date,
    status: {
      type: String,
      enum: [PENDING, RELEASED]
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model('escrow', escrowSchema);
