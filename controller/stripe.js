const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const VendorStripInfo = require('../models/vendorStripInfo');

const createAccount = async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      country: 'US',
      type: 'express',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      business_profile: { url: process.env.STRIPE_CONNECT_REDIRECT_URL },
    });
    console.log({ userData: req.userData });
    console.log({ accountId: account.id });
    const vendorStripe = await VendorStripInfo.create({
      vendorId: req.userData.vendorId,
      stripeAccountId: account.id,
    });
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.STRIPE_CONNECT_REDIRECT_URL}/reauth`,
      return_url: `${process.env.STRIPE_CONNECT_REDIRECT_URL}/return`,
      type: 'account_onboarding',
    });

    res.status(200).json({
      url: accountLink.url,
      message: 'Account created successfully',
    });
  } catch (error) {
    console.log('createAccount', error.message);
    res.status(400).json({ message: error.message });
  }
};

const getAccountInfo = async (req, res) => {
  try {
    const vendorStripe = await VendorStripInfo.find({
      vendorId: req.userData.vendorId,
    });
    const account = await stripe.accounts.retrieve(
      vendorStripe.stripeAccountId,
    );
    res.status(200).json({
      account,
    });
  } catch (error) {
    console.log('getAccountInfo', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createAccount,
  getAccountInfo,
};
