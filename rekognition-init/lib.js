"use strict";

var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
var s3 = new AWS.S3({ apiVersion: "2006-03-01" });
var rekognition = new AWS.Rekognition({ apiVersion: "2016-06-27" });

var bucketParams = {
  Bucket: "samhood"
};

async function imageList() {
  try {
    const s3Promise = s3.listObjects(bucketParams).promise();
    const promiseResult = await s3Promise;
    var imageNameArray = [];
    // Create an array of image names
    for (var i = 0; i < promiseResult.Contents.length; i++) {
      // To do: Check if the object name contains .jpeg or .png
      imageNameArray.push(promiseResult.Contents[i].Key);
    }
    return imageNameArray;
    // console.log(imageNameArray);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

// put images into collection, if collection doesn't exist create it
async function checkFaceCollectionExists() {
  try {
    const rekognitionCollectionPromise = rekognition
      .listCollections({})
      .promise();
    const result = await rekognitionCollectionPromise;

    if (result.CollectionIds.length === 0) {
      return false;
    }
    for (var i = 0; i < result.CollectionIds.Length; i++) {
      if (result.CollectionIds[i] == "samhoodfaces") {
        return true;
      }
    }

    return false;
  } catch (e) {
    console.log(e);
  }
}

async function createSamHoodFaceCollection() {
  try {
    var collectionParams = {
      CollectionId: "samhoodfaces"
    };

    var createCollectionPromise = rekognition
      .createCollection(collectionParams)
      .promise();
    let _ = await createCollectionPromise;
  } catch (e) {
    // if (e.code === "ResourceAlreadyExistsException") {
    //   return;
    // }
  }
}

// store the output of indexFaces() into a JSON file and put the file
// onto S3

module.exports = {
  imageList,
  checkFaceCollectionExists,
  createSamHoodFaceCollection
};
