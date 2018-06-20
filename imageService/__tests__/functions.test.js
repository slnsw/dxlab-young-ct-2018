const fs = require("fs");
const path = require("path");
const functions = require("../functions");
const imageAnalysisLib = require("../../rekognition-init/lib");

var aws = require("aws-sdk");
aws.config.update({ region: "ap-southeast-2" });
var s3 = new aws.S3({ apiVersion: "2006-03-01" });
var rekognition = new aws.Rekognition();

const mockBucket = "dxlabimagebucket";
const mockCollection = "samhoodtest";

describe("functions", async () => {
  beforeAll(async () => {
    // Check if the bucket already exists
    const buckets = await s3.listBuckets({}).promise();

    if (buckets.Buckets.map(bucket => bucket === mockBucket) === 0) {
      const mockBucketParams = {
        Bucket: mockBucket,
        CreateBucketConfiguration: {
          LocationConstraint: "ap-southeast-2"
        }
      };
      await s3.createBucket(mockBucketParams).promise();

      const mockFolderPath = path.join(__dirname, "./mockItems");
      const files = fs.readdirSync(mockFolderPath);

      for (const file of files) {
        const filePath = path.join(mockFolderPath, file);
        const fileBuffer = fs.readFileSync(filePath);
        await s3
          .upload({
            Bucket: mockBucket,
            Key: file,
            Body: fileBuffer
          })
          .promise();
      }
    }

    // If Rekognition mock collection does not exist, create it
    if (!(await imageAnalysisLib.checkFaceCollectionExists(mockCollection))) {
      await imageAnalysisLib.createRekognitionFaceCollection(mockCollection);
      const imageList = await imageAnalysisLib.imageList(mockBucket);

      for (var image of imageList) {
        const analysisParams = {
          CollectionId: mockCollection,
          DetectionAttributes: [],
          ExternalImageId: image,
          Image: { S3Object: { Bucket: mockBucket, Name: image } }
        };

        await rekognition.indexFaces(analysisParams).promise();
      }
    }
  }, 30000);

  it("should list images in an S3 bucket", async () => {
    const result = await functions.images(mockBucket);
    expect(result.length).toBe(10);
  });

  it("should return metadata for a specific image", async () => {
    const imageName = "hood_00101r.jpg";
    const result = await functions.image(mockBucket, imageName);

    expect(result.FaceRecords[0].Face.FaceId).toBe(
      "c6d6cab5-e730-4b99-a294-12cb9d3f6efb"
    );
    expect(result.FaceRecords.length).toBe(1);
    expect(typeof result.FaceRecords === "object").toBe(true);
  });

  it("should search faces that are similar in other images", async () => {
    // Get a Face ID, do this by getting the first face in the collection
    var getFaceParams = {
      CollectionId: mockCollection,
      MaxResults: 1
    };

    const faces = await rekognition.listFaces(getFaceParams).promise();
    const faceId = faces.Faces[0].FaceId;

    // Search for FaceID with the appropriate function call
    const result = await functions.faceSearch(mockCollection, faceId);

    expect(result.FaceMatches.length).toBe(0);
  });
});
