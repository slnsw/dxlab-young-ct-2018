const lib = require('./lib');

// const bucketName = "samhood";
const bucketName = 'dxlab-young-ct-2018-assets';
const rekognitionFaceCollection = 'samhoodfaces';

async function script() {
  const imageNames = await lib.imageList(bucketName);

  if (!(await lib.checkFaceCollectionExists(rekognitionFaceCollection))) {
    await lib.createRekognitionFaceCollection(rekognitionFaceCollection);
  }

  await lib.indexFacesToCollection(
    rekognitionFaceCollection,
    bucketName,
    imageNames
  );
}

script();
