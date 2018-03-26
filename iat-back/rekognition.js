'use strict';

const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const rek = new AWS.Rekognition();

class Rekognition {
    static addImagesToCollection(params) {
        return new Promise((resolve, reject) => {
            // Check if required parameters are present
            if (params.bucketName === null || params.images === null) {
                return reject(new Error("This request must contain bucketName and images keys"));
            }

            return resolve();

            // List collections, if collection name matching bucket name isn't found
            // create the collection

            // If images are in S3, run IndexFaces into the collection. IndexFaces won't 
            // enter duplicate values into a Rekognition collection

        });
    }
}