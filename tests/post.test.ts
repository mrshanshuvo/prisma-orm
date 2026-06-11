import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/db";
import { cleanDatabase } from "./testHelpers";

let testAuthorId: number;

beforeAll(async () => {
  await cleanDatabase();

  const user = await prisma.user.create({
    data: {
      email: "author@example.com",
      name: "Author User",
    },
  });
  testAuthorId = user.id;
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe("Post Integration Tests", () => {
  it("should create a new post successfully", async () => {
    const res = await request(app)
      .post("/posts")
      .send({
        title: "Test Post Title",
        content: "Test post content description",
        published: true,
        authorId: testAuthorId,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.title).toBe("Test Post Title");
  });

  it("should reject post creation when title is missing", async () => {
    const res = await request(app)
      .post("/posts")
      .send({
        content: "Missing title",
        authorId: testAuthorId,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("title");
  });

  it("should search posts by title (case-insensitive)", async () => {
    const res = await request(app)
      .get("/posts?search=title");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.meta.total).toBe(1);
    expect(res.body.data.result[0].title).toBe("Test Post Title");
  });

  it("should return empty result array when search queries do not match", async () => {
    const res = await request(app)
      .get("/posts?search=nonexistentterm");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.meta.total).toBe(0);
    expect(res.body.data.result.length).toBe(0);
  });
});
