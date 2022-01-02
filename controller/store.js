const Store = require('../models/Store');

const addStore = async (req, res) => {
  try {
    const store = await Store.createStoreAndEssence(req.userData, req.body.store);
    res.status(200).json({ store, message: 'Store created successfully' });
  } catch (error) {
    console.log('addStore', error.message);
    res.status(400).json({ message: error.message });
  }
};

/**
 * 
 * @modelFunc {getLabeledInfo} it will always be the naming convention for the functions on 
 * get request to get models info plus all associations with enums mapped
 * @param {storeId} mongoDB _id of store
 */
const storeInfo = async (req, res) => {
  try {
    const store = await Store.getLabeledInfo(req.params.storeId);
    res.status(200).json({ store });
  } catch (error) {
    console.log('storeInfo', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addStore,
  storeInfo
}