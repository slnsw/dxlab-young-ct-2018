import {promisify} from "util";
import rekognition from "../rekognition";

test(`No params return 400`, () => {
    const result = handler({}, {});
    result.then(data => {
        
    })
});