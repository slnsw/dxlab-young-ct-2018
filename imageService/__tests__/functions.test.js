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
      const _ = await imageAnalysisLib.indexFacesToCollection(
        mockCollection,
        mockBucket,
        imageList
      );
    }
  }, 30000);

  it("should list images in an S3 bucket", async () => {
    const result = await functions.images(mockBucket);
    expect(result.length).toBe(10);
  });

  it("should return similar faces for all faces in an image", async () => {
    const mockImage = "hood_00101r.jpg";
    // Make call to function
    const result = await functions.getFaces(
      mockBucket,
      mockCollection,
      mockImage
    );

    // Check the components of the JSON to ensure the structure is matched
    // Non empty JSON
    expect(result.faceRecords.length).toBeGreaterThan(0);
    // Test that field exists
    expect(result.faceRecords[0].face.matchingFaces).toBe(null);
  });
});
