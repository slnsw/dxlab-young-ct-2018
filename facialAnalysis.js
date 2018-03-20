'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const rek = new AWS.Rekognition();

// Offer different endpoints available for the handler to access
class FacialAnalysis {
    static listFaces() {
        const s3Params = {
            Bucket: "samhood",
            MaxKeys: 8
        };

        return new Promise((resolve, reject) => {
            s3.listObjects(s3Params, function(error, s3Data) {
                if (error) {
                    return reject(new Error(error));
                }
                if (s3Data.length === 0) {
                    return reject(new Error("There are no images in the s3 bucket"));
                }

                var imageData = [];

                s3Data.Contents.forEach(function(item, i) {
                    const rekParams = {
                        Image: {
                            S3Object: {
                                Bucket: s3Params.Bucket,
                                Name: item.Key
                            }
                        }
                    };

                    rek.detectFaces(rekParams, function(rekError, rekData) {
                        if (rekError) {
                            return reject(new Error(rekError));
                        }
                        imageData.push({[item.Key]: rekData});

                        if (i === s3Data.MaxKeys - 1) {
                            console.log(rekData);
                            return resolve(imageData);
                        }
                    });

                });
            });
        });
    }
}

module.exports = FacialAnalysis;
