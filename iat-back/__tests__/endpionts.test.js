'use strict';

const util = require('util');
require('util.promisify').shim();
const lambda = require('../endpoints.js');
const handler = util.promisify(lambda);

describe(`addImagesToCollection service`, () => {
    test(`Require parameters`, () => {
        const params = {};

    const result = handler(event, context);
        result.then(data => {
            expect(data).toBeFalsy();
        })
        .catch(e => {
            expect(e).toBe(`This request must contain bucketName and images keys`);
        });
    });
});