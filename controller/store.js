const Store = require('../models/store');
const Designs = require('../models/design');

const addStore = async (req, res) => {
  try {
    // console.log('req', req.body);
    // console.log('logo', req.files.logo[0].location);
    // console.log('coverAvatar', req.files.coverAvatar[0].location);
    // console.log('designURL', req.designURL);

    const data = {
      name: req.body.storeInfo.name,
      slug: req.body.storeInfo.slug,
      design: req.body.storeInfo.design,
      logo: req.body.storeInfo.logo,
      coverAvatar: req.body.storeInfo.coverAvatar,
      products: JSON.parse(req.body.storeInfo.products),
    };

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
    console.log({ store });
    res.status(200).json({ store });
  } catch (error) {
    console.log('storeInfo', error.message);
    res.status(400).json({ message: error.message });
  }
};

const validateSlug = async (req, res) => {
  try {
    const store = await Store.findOne({ slug: decodeURI(req.params.slug) });
    console.log({ store });
    if (store) {
      throw new Error('Slug already taken');
    }
    res.status(200).json({ message: 'valid' });
  } catch (error) {
    console.log('validateSlug', error.message);
    res.status(400).json({ message: error.message });
  }
};

const getStoreBySlug = async (req, res) => {
  try {
    const store = await Store.getLabeledInfoBySlug(req.params.slug);
    res.status(200).json({ store });
  } catch (error) {
    console.log('storeInfo', error.message);
    res.status(400).json({ message: error.message });
  }
};

const designs = async (req, res) => {
  try {
    const designs = await Store.getDesigns(req.userData.vendorId);
    res.status(200).json({ designs });
  } catch (e) {
    console.log('designs', error.message);
    res.status(400).json({ message: error.message });
  }
};

const addDesign = async (req, res) => {
  try {
    const design = await Store.createDesign(req.body, req.userData.vendorId);
    res.status(200).json({ design });
  } catch (error) {
    console.log('addDesign', error.message);
    res.status(400).json({ message: error.message });
  }
};

const singleDesign = async (req, res) => {
  try {
    const design = await Store.getSingleDesign(req.params.designId);
    res.status(200).json({ design });
  } catch (error) {
    console.log('singleDesign', error.message);
    res.status(400).json({ message: error.message });
  }
};

const singleDesignProducts = async (req, res) => {
  try {
    const design = await Store.getSingleDesignProducts(req.params.designId);
    res.status(200).json({ design });
  } catch (error) {
    console.log('singleDesignProducts', error.message);
    res.status(400).json({ message: error.message });
  }
};

const updateDesign = async (req, res) => {
  try {
    const design = await Designs.updateDesign(
      req.params.designId,
      req.body.design,
    );
    res.status(200).json({ design });
  } catch (error) {
    console.log('updateDesign', error.message);
    res.status(400).json({ message: error.message });
  }
};

const updateDesignProducts = async (req, res) => {
  try {
    const design = await Store.updateDesign(
      req.params.designId,
      req.userData.vendorId,
      req.body,
    );
    res.status(200).json({ design });
  } catch (error) {
    console.log('updateDesignProducts', error.message);
    res.status(400).json({ message: error.message });
  }
};

const updateStoreData = async (req, res) => {
  try {
    const store = await Store.updateStoreData(req.body.store);
    res.status(200).json({ store });
  } catch (error) {
    console.log('updateStoreData', error.message);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addStore,
  storeInfo,
  validateSlug,
  getStoreBySlug,
  designs,
  addDesign,
  singleDesign,
  singleDesignProducts,
  updateDesign,
  updateDesignProducts,
  updateStoreData,
};
