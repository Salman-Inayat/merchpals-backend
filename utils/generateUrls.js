const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');

aws.config.update({
  accessKeyId: process.env.AWS_MP_SYSTEM_ACCESS_ID,
  secretAccessKey: process.env.AWS_MP_SYSTEM_SECRET_KEY,
  region: process.env.AWS_S3_REGION,
});

const generatePresignedURLs = () => {
  const s3 = new aws.S3({
    accessKeyId: process.env.AWS_MP_SYSTEM_ACCESS_ID,
    secretAccessKey: process.env.AWS_MP_SYSTEM_SECRET_KEY,
    region: process.env.AWS_S3_REGION,
    Bucket: process.env.AWS_S3_DESIGN_BUCKET,
    signatureVersion: 'v4',
  });

  const id = uuidv4();

  const urlNames = [
    'logo.png',
    'cover-avatar.png',
    '3600x3600.png',
    '2700x2700.png',
    '1050x1050.png',
    '879x1833.png',
    'thumbnail.png',
    'design.json',
  ];

  const getUrls = urlNames.map(name => {
    const params = {
      Bucket: process.env.AWS_S3_DESIGN_BUCKET,
      Key: `${id}/${name}`,
    };

    const URL = `https://${process.env.AWS_S3_DESIGN_BUCKET}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${id}/${name}`;
    return {
      name,
      imageUrl: URL,
    };
  });

  const putUrls = urlNames.map(name => {
    const params = {
      Bucket: process.env.AWS_S3_DESIGN_BUCKET,
      Key: `${id}/${name}`,
      Expires: 60 * 5,
      ContentType: 'image/png',
    };

    const URL = s3.getSignedUrl('putObject', params);
    return {
      name,
      imageUrl: URL,
    };
  });

  const urls = {
    putUrls,
    getUrls,
  };

  return urls;
};

module.exports = {
  generatePresignedURLs,
};
