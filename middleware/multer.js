const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const BUCKET_NAME = 'merchpals-mvp';

aws.config.update({
  accessKeyId: 'AKIAWUDRFMMZSL2ATNGU',
  secretAccessKey: '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',
  region: 'us-east-2',
});

const upload = multer({
  storage: multerS3({
    s3: new aws.S3(),
    bucket: BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, 'stores/' + req.userData._id + '/' + file.originalname);
    },
  }),
});

const signatures = {
  JVBERi0: 'application/pdf',
  R0lGODdh: 'image/gif',
  R0lGODlh: 'image/gif',
  iVBORw0KGgo: 'image/png',
  '/9j/': 'image/jpg',
};

const detectMimeType = b64 => {
  for (var s in signatures) {
    if (b64.indexOf(s) === 0) {
      return signatures[s];
    }
  }
};

const makeid = length => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const uploadBase64 = async (req, res, next) => {
  if (req.body.design) {
    const design = JSON.parse(req.body.design);

    // design = {
    //   base64Image: '',
    //   name: '',
    //   canvasJson
    // }
    buf = Buffer.from(
      design.base64Image.replace(/^data:image\/\w+;base64,/, ''),
      'base64',
    );
    var s3Bucket = new aws.S3();

    var data = {
      Bucket: BUCKET_NAME,
      Key: `designs/${req.userData._id}/${design.name}`,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: detectMimeType(design.base64Image),
    };

    try {
      const { Location } = await s3Bucket.upload(data).promise();
      delete design.base64Image;
      req.body.design = {
        imageUrl: Location,
        ...design,
      };
    } catch (error) {
      console.log(error);
    }

    next();
  } else {
    const store = req.body.store;
    var s3Bucket = new aws.S3();

    if (store.storeData.coverAvatar.startsWith('data:image')) {
      coverAvatarBuf = Buffer.from(
        store.storeData.coverAvatar.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );

      var coverAvatarData = {
        Bucket: BUCKET_NAME,
        Key: `stores/${req.userData._id}/${makeid(10)}`,
        Body: coverAvatarBuf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      };

      try {
        const coverAvatarLocation = await s3Bucket
          .upload(coverAvatarData)
          .promise();

        delete store.storeData.coverAvatar;

        req.body.store.storeData = {
          coverAvatar: coverAvatarLocation.Location,
          ...store.storeData,
        };
      } catch (error) {
        console.log(error);
      }
    }

    if (store.storeData.logo.startsWith('data:image')) {
      logoBuf = Buffer.from(
        store.storeData.logo.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      );

      var logoData = {
        Bucket: BUCKET_NAME,
        Key: `stores/${req.userData._id}/${makeid(10)}`,
        Body: logoBuf,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg',
      };

      try {
        const logoLocation = await s3Bucket.upload(logoData).promise();

        delete store.storeData.logo;

        req.body.store.storeData = {
          logo: logoLocation.Location,
          ...store.storeData,
        };
      } catch (error) {
        console.log(error);
      }
    }
    next();
  }
};

module.exports = {
  upload,
  uploadBase64,
};
