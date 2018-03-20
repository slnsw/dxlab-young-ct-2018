'use strict';

const Rekognition = require("./rekognition.js");

module.exports.rekognition = (event, context, callback) => {
    return Rekognition.addImagesToCollection(event).then(() => {
        const response = {
            isBase64Encoded: false,
            statusCode: 200
        };
        callback(null, response);
    })
    .catch((error) => {
        callback(null, {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: error.message || 'Internal server error',
        })
    });
}