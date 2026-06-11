import request from "supertest";
import app from "../src/app";
import fs from "fs";
import path from "path";

jest.mock("cloudinary", () => ({
  __esModule: true,
  v2: {
    config: () => {},
    uploader: {
      upload: (filePath: string) => {
        if (filePath.includes("video")) {
          return Promise.resolve({
            secure_url:
              "https://res.cloudinary.com/demo/video/upload/sample.mp4",
          });
        }
        return Promise.resolve({
          secure_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        });
      },
    },
  },
}));

describe("Upload Integration Tests", () => {
  const uploadDir = path.join(process.cwd(), "uploads");

  afterAll(() => {
    // Clean up uploaded files after tests run
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      for (const file of files) {
        const filePath = path.join(uploadDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
    }
  });

  it("should upload a single file successfully to Cloudinary", async () => {
    const res = await request(app)
      .post("/upload/single")
      .attach("file", Buffer.from("dummy image content"), "dummy.png");

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("File uploaded successfully to Cloudinary");
    expect(res.body.data).toHaveProperty("url");
    expect(res.body.data.url).toContain("cloudinary.com");
  });

  it("should upload multiple files successfully to Cloudinary", async () => {
    const res = await request(app)
      .post("/upload/multiple")
      .attach("files", Buffer.from("dummy video 1"), "video1.mp4")
      .attach("files", Buffer.from("dummy video 2"), "video2.mp4");

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Files uploaded successfully to Cloudinary");
    expect(res.body.data).toHaveProperty("urls");
    expect(res.body.data.urls.length).toBe(2);
    expect(res.body.data.urls[0]).toContain("cloudinary.com");
  });

  it("should return 400 when no file is uploaded to single endpoint", async () => {
    const res = await request(app).post("/upload/single");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No file uploaded");
  });
});
