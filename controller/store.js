const Store = require('../models/Store');

const addStore = async (req, res) => {
  try {
    console.log('req', req.body);
    console.log('file', req.files);
    const data = {
      name: req.body.name,
      slug: req.body.slug,
      designs: req.body.designs,
      products: JSON.parse(req.body.products)
    }
    const store = await Store.createStoreAndEssence(req.userData, data);
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
    const store = await Store.getLabeledInfo(req.userData._id);
    res.status(200).json({ store });
  } catch (error) {
    console.log('storeInfo', error.message);
    res.status(400).json({ message: error.message });
  }
};

const validateSlug = async (req, res) => {
  try {
    const store = await Store.findOne({slug: decodeURI(req.params.slug)});
    console.log({store});
    if (store) {
      throw new Error('Slug already taken')
    }
    res.status(200).json({ message: "valid" });
  } catch (error) {
    console.log('validateSlug', error.message);
    res.status(400).json({ message: error.message });    
  }
}

const getStoreBySlug = async (req, res) => {
  try {
    const store = await Store.getLabeledInfoBySlug(req.params.slug);
    res.status(200).json({ store });
  } catch (error) {
    console.log('storeInfo', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addStore,
  storeInfo,
  validateSlug,
  getStoreBySlug
}