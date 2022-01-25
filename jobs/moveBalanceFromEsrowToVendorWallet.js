const Escrow = require('../models/escrow');
const Vendor = require('../models/vendor');
const moment = require('moment');

const updateBalance = async function () {
  try {
    const escrowsWithTodayRelease = await Escrow.find({});
    for (var i in escrowsWithTodayRelease) {
      const escrow = escrowsWithTodayRelease[i];
      const vendor = await Vendor.findOne({
        _id: escrow.vendorId,
        releaseDate: {
          $gte: moment().utc().startOf('day'),
          $lte: moment().utc().endOf('day'),
        },
      });
      vendor.balance = Number(
        (vendor.balance + escrow.vendorProfit).toFixed(2),
      );
      await vendor.save();
    }
  } catch (e) {
    console.log({ error: e.message });
  }
};

module.exports = updateBalance;
