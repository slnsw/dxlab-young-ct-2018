'use strict';

const FacialAnalysis = require("./facialAnalysis.js");

module.exports.facialAnalysis = (event, context, callback) => {
    // Provide an endpoint to the facial analysis endpiont
    return FacialAnalysis.listFaces().then((data) => {
        const response = {
            isBase64Encoded: false,
            statusCode: 200,
            body: JSON.stringify(data)
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