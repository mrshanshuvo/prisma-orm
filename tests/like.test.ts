import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/db";
import { cleanDatabase } from "./testHelpers";

let testUserId: number;
let testPostId: number;

beforeAll(async () => {
  await cleanDatabase();

  const user = await prisma.user.create({
    data: {
      email: "liker@example.com",
      name: "Liker User",
    },
  });
  testUserId = user.id;

  const post = await prisma.post.create({
    data: {
      title: "Liked Post",
      content: "Liked content",
      published: true,
      authorId: testUserId,
    },
  });
  testPostId = post.id;
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe("Like Integration Tests", () => {
  it("should toggle a like successfully (create state)", async () => {
    const res = await request(app)
      .post("/likes")
      .send({
        postId: testPostId,
        userId: testUserId,
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Created successfully");
    expect(res.body.data).toHaveProperty("id");
  });

  it("should toggle a like successfully (delete state)", async () => {
    const res = await request(app)
      .post("/likes")
      .send({
        postId: testPostId,
        userId: testUserId,
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Deleted successfully");
  });

  it("should reject toggle like with missing parameters", async () => {
    const res = await request(app)
      .post("/likes")
      .send({
        postId: testPostId,
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
