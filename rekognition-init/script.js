"use strict";

// enumerate all images into s3, we want just the names of the images
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "ap-southeast-2" });

// Create S3 service object
var s3 = new AWS.S3({ apiVersion: "2006-03-01" });

var bucketParams = {
  Bucket: "samhood"
};

const s3Promise = s3.listObjects(bucketParams).promise();

// Immediately invoked function expression, create a closure on the top
// level. To do: Find a better way to do this.
(async function() {
  const result = await s3Promise;
  console.log(result);
})();

// put images into collection, if collection doesn't exist create it

// store the output of indexFaces() into a JSON file and put the file
// onto S3
