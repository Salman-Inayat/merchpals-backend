const multer = require('multer');
const aws = require('aws-sdk');
const BUCKET_NAME = 'merchpals-mvp';

var multerS3 = require('multer-s3');
aws.config.region = 'us-east-2';

// aws.config.update({
//   accessKeyId: 'AKIAWUDRFMMZSL2ATNGU',
//   secretAccessKey: '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',
//   region: 'us-east-2',
// });
// var upload = multer({
//   storage: multerS3({
//     s3: new aws.S3(),
//     bucket: BUCKET_NAME,
//     acl: 'public-read',
//     contentType: multerS3.AUTO_CONTENT_TYPE,
//     metadata: function (req, file, cb) {
//       console.log(file);
//       cb(null, 'test.jpg');
//     },
//     key: function (req, file, cb) {
//       cb(null, '/' + Date.now().toString() + '_' + file.originalname);
//     },
//   }),
// });

const PATH = './public/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        const fileName = 'test.jpg';
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {

        console.log(file)
        // if (file.mimetype == "application/pdf") {
            cb(null, true);
        // } else {
            // cb(null, false);
            // return cb(new Error('Allowed only .pdf'));
        // }
    }
});

module.exports = {
  upload,
};
