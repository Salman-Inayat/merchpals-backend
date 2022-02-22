const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');
const BUCKET_NAME = 'dummy-merchpals';

aws.config.update({
  accessKeyId: 'AKIAWUDRFMMZSL2ATNGU',
  secretAccessKey: 'gVr6A976ziFZhfXDFH1kYIche731om7UcQPwDrMY',
  // region: 'us-east-2',
  region: 'us-east-1',
});

const generatePresignedURLs = () => {
  const s3 = new aws.S3({
    accessKeyId: 'AKIAWUDRFMMZSL2ATNGU',
    secretAccessKey: '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',
    region: 'us-east-1',
    Bucket: BUCKET_NAME,
    signatureVersion: 'v4',
  });

  const designId = uuidv4();
  const storeId = uuidv4();

  // getUrls to be stored in the db
  const getLogoURL = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: `${storeId}/logo.png`,
  });

  const getLoverAvatarURL = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: `${storeId}/cover-avatar.png`,
  });

  const getDesignVariant1URL = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/3600x3600.png`,
  });

  const getDesignVariant2URL = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/2700x2700.png`,
  });

  const getDesignVariant3URL = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/1050x1050.png`,
  });

  const getDesignVariant4URL = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/879x1833.png`,
  });

  const getDesignVariant5URL = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/thumbnail.png`,
  });

  const getDesignJsonURL = s3.getSignedUrl('getObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/design.json`,
  });

  // putUrls to be sent to the frontend where PUT request is made

  const putLogoURL = s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: `${storeId}/logo.png`,
    Expires: 60 * 5,
    ContentType: 'image/png',
  });

  const putCoverAvatarURL = s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: `${storeId}/cover-avatar.png`,
    Expires: 60 * 5,
    ContentType: 'image/png',
  });

  const putDesignVariant1URL = s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/3600x3600.png`,
    Expires: 60 * 5,
    ContentType: 'image/png',
  });

  const putDesignVariant2URL = s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/2700x2700.png`,

    Expires: 60 * 5,
    ContentType: 'image/png',
  });

  const putDesignVariant3URL = s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/1050x1050.png`,
    Expires: 60 * 5,
    ContentType: 'image/png',
  });

  const putDesignVariant4URL = s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/879x1833.png`,
    Expires: 60 * 5,
    ContentType: 'image/png',
  });

  const putDesignVariant5URL = s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/thumbnail.png`,
    Expires: 60 * 5,
    ContentType: 'image/png',
  });

  const putDesignJsonURL = s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: `${designId}/design.json`,
    Expires: 60 * 5,
    ContentType: 'application/json',
  });

  const urls = {
    putUrls: {
      logo: putLogoURL,
      coverAvatar: putCoverAvatarURL,
      variant1: putDesignVariant1URL,
      variant2: putDesignVariant2URL,
      variant3: putDesignVariant3URL,
      variant4: putDesignVariant4URL,
      variant5: putDesignVariant5URL,
      designJson: putDesignJsonURL,
    },
    getUrls: {
      logo: getLogoURL,
      coverAvatar: getLoverAvatarURL,
      variant1: getDesignVariant1URL,
      variant2: getDesignVariant2URL,
      variant3: getDesignVariant3URL,
      variant4: getDesignVariant4URL,
      variant5: getDesignVariant5URL,
      designJson: getDesignJsonURL,
    },
  };

  return urls;
};

module.exports = {
  generatePresignedURLs,
};
