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

  const designJson = data.urls.find(el => el.name === 'design.json');
  data.urls.pop();
  const designImages = data.urls;

  const updatedFields = {
    designJson: designJson.imageUrl,
    designImages: designImages,
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
