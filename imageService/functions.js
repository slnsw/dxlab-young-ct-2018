"use strict";
var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
var s3 = new AWS.S3({ apiVersion: "2006-03-01" });

async function images(bucketName) {
  return new Promise(async (resolve, reject) => {
    try {
      // Retrieve list of objects in the S3 bucket
      const s3Params = {
        Bucket: bucketName
      };

      const result = await s3.listObjectsV2(s3Params).promise();
      var imageList = [];
      // Put keys into an array
      for (const item of result.Contents) {
        if (item.Key.match(/.(jpg|jpeg|png)$/i)) {
          imageList.push(item.Key);
        }
      }

      // Return JSON array of images in S3
      resolve(imageList);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  images
};
