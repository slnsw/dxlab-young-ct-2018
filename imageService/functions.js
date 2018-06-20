"use strict";
var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
var s3 = new AWS.S3({ apiVersion: "2006-03-01" });
var rekognition = new AWS.Rekognition();

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

async function image(bucketName, imageName) {
  return new Promise(async (resolve, reject) => {
    try {
      // Replace image file extension with json extension to retrieve
      // the image's metadata.
      const imageJson = imageName.replace(/\.[^/.]+$/, "") + ".json";
      const getImageJsonParams = {
        Bucket: bucketName,
        Key: imageJson
      };

      const imageJsonResult = await s3.getObject(getImageJsonParams).promise();

      const json = JSON.parse(imageJsonResult.Body.toString());

      resolve(json);
    } catch (e) {
      reject(e);
    }
  });
}

async function faceSearch(collectionId, faceId) {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        CollectionId: collectionId,
        FaceId: faceId,
        FaceMatchThreshold: 95
      };

      const result = await rekognition.searchFaces(params).promise();

      resolve(result);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  images,
  image,
  faceSearch
};
