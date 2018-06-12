"use strict";

const functions = require("./functions");

module.exports.images = (async, context, callback) => {
  return functions
    .images("samhood")
    .then(result => {
      const response = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {},
        body: JSON.stringify(result)
      };
      callback(null, response);
    })
    .catch(e => {
      const error = {
        statusCode: 501,
        body: e.message
      };

      callback(null, error);
    });
};
