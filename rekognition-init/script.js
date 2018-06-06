const lib = require("./lib");

const bucketName = "samhood";
const rekognitionFaceCollection = "samhoodfaces";

async function script() {
  const imageNames = await lib.imageList(bucketName);

  if (!(await lib.checkFaceCollectionExists(rekognitionFaceCollection))) {
    await lib.createRekognitionFaceCollection;
  }

  await lib.indexFacesToCollection(
    rekognitionFaceCollection,
    bucketName,
    imageNames
  );
}

script();
