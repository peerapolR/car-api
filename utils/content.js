const config = require("../config/index");
const aws = require("aws-sdk");
const fs = require("fs");

const s3 = new aws.S3({
  endpoint: config.s3.endpoint,
  accessKeyId: config.s3.accessKeyId,
  secretAccessKey: config.s3.secretAccessKey,
  signatureVersion: config.s3.signatureVersion,
  region: config.s3.region,
});

module.exports.uploadFile = async (data, type, path) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dataObj = {
        Bucket: config.s3.bucket,
        Key: path,
        ContentType: `${type}`,
        Body: data,
      };
      const s3url = await s3.putObject(dataObj).promise();
      resolve({ s3url });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.getImageUrl = async (pathKey, expired = 86400) => {
  if (!pathKey) {
    return pathKey;
  }

  return new Promise(async (resolve, reject) => {
    try {
      await s3.getSignedUrl(
        "getObject",
        {
          Bucket: config.s3.bucket,
          Key: pathKey,
          Expires: expired,
        },
        (error, url) => {
          if (error) {
            reject(error);
          } else {
            resolve({ s3url: url });
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

module.exports.uploadFileFromLocal = async (localFilePath, type, pathKey) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fileStream = fs.createReadStream(localFilePath);
      fileStream.on("error", (err) => {
        console.log(err);
      });

      const dataObj = {
        Bucket: config.s3.bucket,
        Key: pathKey,
        Body: fileStream,
      };

      if (type) {
        dataObj.ContentType = type;
      }

      const s3url = await s3.putObject(dataObj).promise();
      resolve({ s3url });
    } catch (error) {
      reject(error);
    }
  });
};
