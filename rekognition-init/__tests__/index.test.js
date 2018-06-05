const script = require("../lib");

describe("s3", () => {
  it("should return list of objects", async () => {
    const result = await script.imageList();
    expect(result.length).toBe(100);
    expect(result[0]).toEqual("hood_00101r.jpg");
  });
});

describe("checkRekognitionCollections", () => {
  it("should check if sam hood face collection exists", async () => {
    const result = await script.checkFaceCollectionExists();
    expect(result).toBeDefined();
  });
});

describe("createRekognitionCollection", () => {
  it("should attempt creation of Rekognition face collection", async () => {
    const result = await script.createSamHoodFaceCollection();
    expect(result).toBeUndefined();
  });
});
