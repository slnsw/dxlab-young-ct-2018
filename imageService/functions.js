"use strict";
var AWS = require("aws-sdk");
AWS.config.update({ region: "ap-southeast-2" });
var s3 = new AWS.S3({ apiVersion: "2006-03-01" });

class Function {
  image(event) {
    return new Promise((resolve, reject) => {
      // Retrieve list of objects in the S3 bucket
      const s3Params = {
        Bucket: "samhood"
      };

      const result = await s3.listObjectsV2(s3Params).promise();
      // Put keys into an array
      // Filter for .jpg .png images
      // Return JSON array of images in S3
    });
  }
}
