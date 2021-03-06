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

async function getFaces(bucketName, collectionId, imageName) {
  return new Promise(async (resolve, reject) => {
    try {
      const imageJson = imageName.replace(/\.[^/.]+$/, "") + ".json";

      const facesInImageParams = {
        Bucket: bucketName,
        Key: imageJson
      };

      // Run script to make the object keys lowercase
      const analysisResult = await s3.getObject(facesInImageParams).promise();
      var json = JSON.parse(analysisResult.Body.toString());

      // Convert everything over to camelCase
      json = toCamel(json);

      // Loop through the faces to search with the individual faceId
      // and append a matchingFaces object to the face
      // To do: set this up to be done in parallel
      for (const faceRecord of json.faceRecords) {
        const faceSearchParams = {
          CollectionId: collectionId,
          FaceId: faceRecord.face.faceId,
          FaceMatchThreshold: 95
        };

        const faceSearchResults = await rekognition
          .searchFaces(faceSearchParams)
          .promise();

        faceSearchResults.FaceMatches.length == 0
          ? (faceRecord.face.matchingFaces = null)
          : (faceRecord.face.matchingFaces = toCamel(
              faceSearchResults.FaceMatches
            ));
      }

      // Return promise object
      resolve(json);
    } catch (e) {
      reject(e);
    }
  });
}

function toCamel(o) {
  var newO, origKey, newKey, value;
  if (o instanceof Array) {
    return o.map(function(value) {
      if (typeof value === "object") {
        value = toCamel(value);
      }
      return value;
    });
  } else {
    newO = {};
    for (origKey in o) {
      if (o.hasOwnProperty(origKey)) {
        newKey = (
          origKey.charAt(0).toLowerCase() + origKey.slice(1) || origKey
        ).toString();
        value = o[origKey];
        if (
          value instanceof Array ||
          (value !== null && value.constructor === Object)
        ) {
          value = toCamel(value);
        }
        newO[newKey] = value;
      }
    }
  }
  return newO;
}

module.exports = {
  images,
  getFaces
};
