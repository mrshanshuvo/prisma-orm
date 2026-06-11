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
  it("should create a new post successfully with images and videos", async () => {
    const res = await request(app)
      .post("/posts")
      .send({
        title: "Test Post Title",
        content: "Test post content description",
        published: true,
        authorId: testAuthorId,
        images: ["https://picsum.photos/600/400"],
        videos: ["https://example.com/video.mp4"],
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.title).toBe("Test Post Title");
    expect(res.body.data.images).toEqual(["https://picsum.photos/600/400"]);
    expect(res.body.data.videos).toEqual(["https://example.com/video.mp4"]);
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

  it("should return empty result array when search queries do not match", async () => {
    const res = await request(app)
      .get("/posts?search=nonexistentterm");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.meta.total).toBe(0);
    expect(res.body.data.result.length).toBe(0);
  });

  it("should return 404 if post not found", async () => {
    const res = await request(app).get("/posts/99999");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Post not found");
  });

  it("should return 400 if post ID is invalid format", async () => {
    const res = await request(app).get("/posts/abc");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("post ID");
  });

  it("should reject post creation when images is not an array", async () => {
    const res = await request(app)
      .post("/posts")
      .send({
        title: "Bad Post Media",
        authorId: testAuthorId,
        images: "not-an-array",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should search posts by title (case-insensitive)", async () => {
    const res = await request(app)
      .get("/posts?search=title");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.meta.total).toBe(1);
    expect(res.body.data.result[0].title).toBe("Test Post Title");
  });

  it("should update post successfully including media arrays", async () => {
    const postsRes = await request(app).get("/posts");
    const postId = postsRes.body.data.result[0].id;

    const res = await request(app)
      .put(`/posts/${postId}`)
      .send({
        title: "Updated Post Title",
        images: ["https://picsum.photos/800/600"],
      });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Updated Post Title");
    expect(res.body.data.images).toEqual(["https://picsum.photos/800/600"]);
  });

  it("should cascade delete comments and likes when post is deleted", async () => {
    const user = await prisma.user.create({
      data: { email: "post-deleter@example.com" },
    });

    const post = await prisma.post.create({
      data: { title: "Deleter Post", authorId: user.id },
    });

    const comment = await prisma.comment.create({
      data: { content: "Deleter Comment", postId: post.id, authorId: user.id },
    });

    const like = await prisma.like.create({
      data: { postId: post.id, userId: user.id },
    });

    // Delete post
    const res = await request(app).delete(`/posts/${post.id}`);
    expect(res.status).toBe(200);

    // Verify cascade deletes
    const dbPost = await prisma.post.findUnique({ where: { id: post.id } });
    const dbComment = await prisma.comment.findUnique({ where: { id: comment.id } });
    const dbLike = await prisma.like.findUnique({
      where: { postId_userId: { postId: post.id, userId: user.id } },
    });

    expect(dbPost).toBeNull();
    expect(dbComment).toBeNull();
    expect(dbLike).toBeNull();
  });
});
