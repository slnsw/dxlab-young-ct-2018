"use strict";

var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
var s3 = new AWS.S3({ apiVersion: "2006-03-01" });
var rekognition = new AWS.Rekognition({ apiVersion: "2016-06-27" });

async function imageList(bucketName) {
  try {
    var bucketParams = {};
    bucketParams["Bucket"] = bucketName;
    // To do: Update this to listObjectsV2
    const promiseResult = await s3.listObjects(bucketParams).promise();
    var imageNameArray = [];
    // Create an array of image names
    for (var i = 0; i < promiseResult.Contents.length; i++) {
      if (promiseResult.Contents[i].Key.match(/.(jpg|jpeg|png)$/i)) {
        imageNameArray.push(promiseResult.Contents[i].Key);
      }
    }
    return imageNameArray;
  } catch (e) {
    console.log(e);
  }
}

// put images into collection, if collection doesn't exist create it
async function checkFaceCollectionExists(faceCollectionName) {
  try {
    const result = await rekognition.listCollections({}).promise();

    if (result.CollectionIds.length === 0) {
      return false;
    }
    for (var i = 0; i < result.CollectionIds.length; i++) {
      if (result.CollectionIds[i] == faceCollectionName) {
        return true;
      }
    }
    return false;
  } catch (e) {
    console.log(e);
  }
}

async function createRekognitionFaceCollection(collectionName) {
  try {
    var collectionParams = {
      CollectionId: collectionName
    };

    var createCollectionPromise = rekognition
      .createCollection(collectionParams)
      .promise();
    let _ = await createCollectionPromise;
  } catch (e) {
    console.log(e);
  }
}

// store the output of indexFaces() into a JSON file and put the file
// onto S3
async function indexFacesToCollection(
  rekognitionCollection,
  bucketName,
  imageList
) {
  try {
    var result = [];
    for (var i = 0; i < imageList.length; i++) {
      var params = {
        CollectionId: rekognitionCollection,
        DetectionAttributes: [],
        ExternalImageId: imageList[i],
        Image: {
          S3Object: {
            Bucket: bucketName,
            Name: imageList[i]
          }
        }
      };
      const json = await rekognition.indexFaces(params).promise();
      // To do: Find a way to do this that won't fail if the file name has a full
      // stop in it.
      const jsonFileName = imageList[i].split(".")[0] + ".json";
      const uploadParams = {
        Bucket: bucketName,
        Key: jsonFileName,
        Body: JSON.stringify(json)
      };
      await s3.upload(uploadParams).promise();
    }
    return result;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  imageList,
  checkFaceCollectionExists,
  createRekognitionFaceCollection,
  indexFacesToCollection
};
