const Store = require('../models/store');
const Designs = require('../models/design');
const { generatePresignedURLs } = require('../utils/generateUrls');

const addStore = async (req, res) => {
  try {
    const urls = generatePresignedURLs();
    const data = {
      name: req.body.name,
      design: {
        designName: req.body.designName,
      },
      urls: urls.getUrls,
      products: JSON.parse(req.body.products),
      themeColor: req.body.themeColor,
    };

    const store = await Store.createStoreAndEssence(req.userData, data);
    res.status(200).json({
      data: {
        store,
        urls: urls.putUrls,
      },
      message: 'Store created successfully',
    });
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
    const { storeName } = req.body;

    const store = await Store.ValidateStoreSlug(storeName);

    if (store) {
      throw new Error('Store name already taken');
    }
    res.status(200).json({ message: 'valid' });
  } catch (error) {
    console.log('validateSlug', error.message);
    res.status(400).json({ message: error.message });
  }
};
// const validateSlug = async (req, res) => {
//   try {
//     const store = await Store.findOne({ slug: decodeURI(req.params.slug) });

//     if (store) {
//       throw new Error('Slug already taken');
//     }
//     res.status(200).json({ message: 'valid' });
//   } catch (error) {
//     console.log('validateSlug', error.message);
//     res.status(400).json({ message: error.message });
//   }
// };

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
    const design = await Store.createDesign(req, req.userData.vendorId);
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
    // const design = await Designs.updateDesign(req.params.designId, req.body.design);
    const design = await Designs.updateDesign(req.params.designId, req);

    res.status(200).json({ design });
  } catch (error) {
    console.log('updateDesign', error.message);
    res.status(400).json({ message: error.message });
  }
};

const updateDesignProducts = async (req, res) => {
  try {
    const design = await Store.updateDesign(req.params.designId, req.userData.vendorId, req.body);
    res.status(200).json({ design });
  } catch (error) {
    console.log('updateDesignProducts', error.message);
    res.status(400).json({ message: error.message });
  }
};

const updateStoreData = async (req, res) => {
  try {
    const store = await Store.findById(req.body.storeId);

    const data = {
      storeId: req.body.storeId,
      name: req.body.name,
      slug: req.body.name.replace(/\s+/g, '-').toLowerCase(),
      logo: req.files.logo ? req.files.logo[0].location : store.logo,
      coverAvatar: req.files.coverAvatar ? req.files.coverAvatar[0].location : store.coverAvatar,
      themeColor: req.body.themeColor ? req.body.themeColor : store.themeColor,
    };

    const updatedStore = await Store.updateStoreData(data);
    res.status(200).json({ updatedStore });
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
