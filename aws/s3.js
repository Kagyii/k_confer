const AWS = require("aws-sdk");
const env = require("dotenv");

env.config();

const ID = process.env.S3_ID;
const SECRET = process.env.S3_SECRET;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

module.exports.uploadImage = (imageArray, bucket) => {
  const promise = [];

  for (let i = 0; i < imageArray.length; i++) {
    let timestamp = Date.now().toString();

    let params = {
      Bucket: bucket,
      Key: `${Math.floor(Math.random() * 1234567) + 1234567}${timestamp}.jpg`,
      Body: new Buffer.from(imageArray[i], "base64"),
      ACL: "public-read",
      ContentType: "image/jpeg",
      ContentEncoding: "base64",
    };

    promise.push(
      new Promise((resolve, reject) => {
        s3.upload(params, function (err, data) {
          if (err) {
            return reject(err);
          }

          return resolve(data.Location);
        });
      })
    );
  }

  return Promise.all(promise);
};

module.exports.deleteImages = (imageArray, bucket) => {
  let imageArrayObj = [];

  imageArray.forEach((i) => {
    imageArrayObj.push({ Key: i });
  });

  let params = {
    Bucket: bucket,
    Delete: {
      Objects: imageArrayObj,
      Quiet: false,
    },
  };

  s3.deleteObjects(params, function (err, data) {
    if (err) console.log(err);
  });
};
