const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const VendorStripInfo = require('../models/vendorStripInfo');
const Transaction = require('../models/transaction');

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
      refresh_url: `${process.env.STRIPE_CONNECT_REDIRECT_URL}`,
      return_url: `${process.env.STRIPE_CONNECT_REDIRECT_URL}`,
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
    let account;
    const vendorStripe = await VendorStripInfo.findOne({
      vendorId: req.userData.vendorId,
    });

    console.log({ vendorStripe });
    if (vendorStripe) {
      account = await stripe.accounts.retrieve(vendorStripe.stripeAccountId);
    }

    res.status(200).json({ account });
  } catch (error) {
    console.log('getAccountInfo', error.message);
    res.status(400).json({ message: error.message });
  }
};

const payout = async (req, res) => {
  try {
    const transaction = await Transaction.initiatePayout(req.userData.vendorId);
    const transfer = await stripe.transfers.create({
      amount: transaction.totalPayout * 100,
      currency: 'usd',
      destination: transaction.stripeAccountId,
    });
    // console.log({ transfer });
    const updatedTransaction = await Transaction.updatePayout(
      transaction,
      transfer,
    );
    res.status(200).json({
      updatedTransaction,
      message: 'Payment successfully transferred!',
    });
  } catch (error) {
    console.log('payout', error.message);
    res.status(400).json({ message: error.message });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const vendorHistory = await Transaction.transactionHistory(
      req.userData.vendorId,
    );

    res.status(200).json({ vendorHistory });
  } catch (error) {
    console.log('payout', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createAccount,
  getAccountInfo,
  payout,
  getTransactionHistory,
};
