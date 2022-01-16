const router = require('express').Router();
const {
  addStore,
  storeInfo,
  validateSlug,
  getStoreBySlug,
  designs,
  singleDesign,
  addDesign,
  singleDesignProducts,
  updateDesignProducts
} = require('../controller/store');
const auth = require('../middleware/auth');
const { upload, uploadBase64 } = require('../middleware/multer');

router.route('/').post(
  auth,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'coverAvatar', maxCount: 1 },
  ]),
  uploadBase64,
  addStore,
);

router.route('/validate-slug/:slug').get(validateSlug);
router.route('/designs').get(auth, designs);
router.route('/design/:designId').get(auth, singleDesign);
router.route('/design/products/:designId').get(singleDesignProducts);
router.route('/design/products/:designId').put(auth, updateDesignProducts);
router.route('/add-design').post(auth, uploadBase64, addDesign);
router.route('/').get(auth, storeInfo);
router.route('/:slug').get(getStoreBySlug);

module.exports = router;
