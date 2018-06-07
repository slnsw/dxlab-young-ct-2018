const fs = require("fs");
const path = require("path");
const functions = require("../functions");

var aws = require("aws-sdk");
aws.config.update({ region: "ap-southeast-2" });
var s3 = new aws.S3({ apiVersion: "2006-03-01" });

const mockBucket = "dxlabmockbucket";

beforeAll(async () => {
  // Create mock testing environment
  const mockBucketParams = {
    Bucket: mockBucket,
    CreateBucketConfiguration: {
      LocationConstraint: "ap-southeast-2"
    }
  };

  await s3.createBucket(mockBucketParams).promise();

  // Add all items in mockItems folder to S3 bucket
  const folderPath = path.join(__dirname, "./mockItems");

  fs.readdir(folderPath, (e, files) => {
    if (e) {
      console.log(e);
      throw e;
    }
    for (const file in files) {
      const filePath = path.join(mockFolderPath, file);

      fs.readFile(filePath, async (e, fileContents) => {
        if (e) {
          console.log(e);
          throw e;
        }

        await s3
          .upload({
            Bucket: mockBucket,
            Key: fileName,
            Buffer: fileContents
          })
          .promise();
      });
    }
  });
});

afterAll(async () => {
  // Delete all items in S3 bucket
  var getBucketObjectsParams = {
    Bucket: mockBucket
  };
  const result = await s3.listObjectsV2(getBucketObjectsParams).promise();

  for (var i = 0; i < result.Contents.length; i++) {
    await s3
      .deleteObject({ Bucket: mockBucketName, Key: result.Contents[i].Key })
      .promise();
  }

  // Delete mock bucket
  const deleteBucketParams = {
    Bucket: mockBucket
  };

  await s3.deleteBucket(deleteBucketParams).promise();
});

describe("functions", async () => {
  it("should list images in an S3 bucket", async () => {});
});
