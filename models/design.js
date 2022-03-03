const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * @field url
 * @description: Design Image's URL
 */

const designSchema = new mongoose.Schema(
  {
    vendorId: {
      type: ObjectId,
      ref: 'vendor',
      required: true,
    },
    vendorProductIds: {
      type: [ObjectId],
      ref: 'vendorProducts',
      required: true,
    },
    storeId: {
      type: ObjectId,
      ref: 'store',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    // url: {
    //   type: String,
    //   required: true,
    // },
    frontDesign: {
      type: Object,
      required: true,
    },
    backDesign: {
      type: Object,
      required: true,
    },
    // designImages: {
    //   type: [Object],
    //   required: true,
    // },
    // designJson: {
    //   type: String,
    //   // required: true,
    // },
  },
  { timestamps: true },
);

designSchema.statics.updateDesign = async function (designId, req) {
  const data = req.body;

  const frontDesignImages = data.urls.filter((design, idx) => idx < 5);
  const backDesignImages = data.urls.filter((design, idx) => idx > 5 && idx < data.urls.length - 1);

  const frontDesignJson = data.urls.find(el => el.name === 'front-design.json');
  const backDesignJson = data.urls.find(el => el.name === 'back-design.json');

  console.log('frontDesignImages', frontDesignImages);
  console.log('backDesignImages', backDesignImages);

  const updatedFields = {
    frontDesign: {
      designJson: frontDesignJson.imageUrl,
      designImages: frontDesignImages,
    },
    backDesign: {
      designJson: backDesignJson.imageUrl,
      designImages: backDesignImages,
    },
  };

  const design = await this.findByIdAndUpdate(
    designId,
    {
      $set: updatedFields,
    },
    { new: true },
  );

  return design;
};

module.exports = mongoose.model('design', designSchema);
