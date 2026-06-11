import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/db";
import { cleanDatabase } from "./testHelpers";

let testAuthorId: number;
let testPostId: number;

beforeAll(async () => {
  await cleanDatabase();

  const user = await prisma.user.create({
    data: {
      email: "commenter@example.com",
      name: "Commenter User",
    },
  });
  testAuthorId = user.id;

  const post = await prisma.post.create({
    data: {
      title: "Target Post Title",
      content: "Target post description",
      published: true,
      authorId: testAuthorId,
    },
  });
  testPostId = post.id;
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe("Comment Integration Tests", () => {
  it("should create a comment successfully with image and emojis", async () => {
    const res = await request(app).post("/comments").send({
      content: "Test Comment Content",
      postId: testPostId,
      authorId: testAuthorId,
      image: "https://picsum.photos/200/200",
      emojis: ["🔥", "❤️"],
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.content).toBe("Test Comment Content");
    expect(res.body.data.image).toBe("https://picsum.photos/200/200");
    expect(res.body.data.emojis).toEqual(["🔥", "❤️"]);
  });

  it("should reject comment creation on invalid schemas", async () => {
    const res = await request(app).post("/comments").send({
      postId: testPostId,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should fetch all comments with pagination", async () => {
    const res = await request(app).get("/comments?page=1&limit=5");

    expect(res.status).toBe(200);
    expect(res.body.data.meta.total).toBe(1);
    expect(res.body.data.result.length).toBe(1);
  });

  it("should update comment content, image, and emojis successfully", async () => {
    const commentsRes = await request(app).get("/comments");
    const commentId = commentsRes.body.data.result[0].id;

    const res = await request(app)
      .put(`/comments/${commentId}`)
      .send({
        content: "Updated Comment Content",
        image: "https://picsum.photos/300/300",
        emojis: ["👍"],
      });

    expect(res.status).toBe(200);
    expect(res.body.data.content).toBe("Updated Comment Content");
    expect(res.body.data.image).toBe("https://picsum.photos/300/300");
    expect(res.body.data.emojis).toEqual(["👍"]);
  });
});
