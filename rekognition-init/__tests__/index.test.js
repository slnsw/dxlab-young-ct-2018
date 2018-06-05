const script = require("../script");

describe("s3", () => {
  it("should return list of objects", async () => {
    const result = await script.imageList();
    expect(result.length).toBe(100);
    expect(result[0]).toEqual("hood_00101r.jpg");
  });
});
