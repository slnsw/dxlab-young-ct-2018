"use strict";

var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
var s3 = new AWS.S3({ apiVersion: "2006-03-01" });
var rekognition = new AWS.Rekognition({ apiVersion: "2016-06-27" });

var bucketParams = {
  Bucket: "samhood"
};

const s3Promise = s3.listObjects(bucketParams).promise();

async function imageList() {
  try {
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

// imageList().then();

const rekognitionCollectionPromise = rekognition.listCollections({}).promise();

// put images into collection, if collection doesn't exist create it
async function checkFaceCollectionExists() {
  try {
    const result = await rekognitionCollectionPromise;
    console.log(result);

    for (var i = 0; i < result.data.CollectionIds.Length; i++) {
      if (result.data.CollectionIds[i] == "samhoodfaces") {
        return;
      }
    }

    // We only reach this point if the collection doesn't exist
    collectionParams = {
      CollectionId: "samhoodfaces"
    };

    const createCollectionResult = await rekognition
      .createCollection(collectionParams)
      .promise();
    console.log(createCollectionResult);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

// checkFaceCollectionExists.then();
// store the output of indexFaces() into a JSON file and put the file
// onto S3

module.exports = { imageList };
