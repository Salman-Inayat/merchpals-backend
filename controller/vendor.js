const mongoose = require('mongoose');
const Vendor = require('../models/vendor');

const getVendorInfo = async (req, res) => {
  try {
    const vendor = await Vendor.getVendorInfo(req);

    res.status(200).json({ vendor, message: 'Orders fetched successfully' });
  } catch (error) {
    console.log('get vendor info controller', error);
    res.status(400).json({ message: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const vendor = await Vendor.updatePassword(req);

    res.status(200).json({ vendor, message: 'Password updated successfully' });
  } catch (error) {
    console.log('update password controller', error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getVendorInfo,
  updatePassword,
};
