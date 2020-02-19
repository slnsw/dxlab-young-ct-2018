'use strict';

const functions = require('./functions');

// const bucket = "samhood";
const bucket = 'dxlab-young-ct-2018-assets';

module.exports.images = (event, context, callback) => {
  return functions
    .images(bucket)
    .then(result => {
      const response = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {},
        body: result,
      };
      callback(null, response);
    })
    .catch(e => {
      const error = {
        statusCode: 501,
        body: e.message,
      };

      callback(null, error);
    });
};

module.exports.getFaces = (event, context, callback) => {
  return functions
    .getFaces(bucket, 'samhoodfaces', event['query']['image'])
    .then(result => {
      const response = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {},
        body: result,
      };

      callback(null, response);
    })
    .catch(e => {
      const error = {
        statusCode: 501,
        body: e.message,
      };
      callback(null, error);
    });
};
