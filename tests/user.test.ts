import request from "supertest";
import app from "../src/app";
import prisma from "../src/config/db";
import { cleanDatabase } from "./testHelpers";

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe("User Integration Tests", () => {
  it("should create a new user successfully", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        email: "testuser@example.com",
        name: "Test User",
        profilePic: "https://picsum.photos/200",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.email).toBe("testuser@example.com");
    expect(res.body.data.profilePic).toBe("https://picsum.photos/200");
  });

  it("should reject creation when email is invalid format", async () => {
    const res = await request(app)
      .post("/users")
      .send({
        email: "invalid-email",
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("email");
  });

  it("should fetch all users with pagination format", async () => {
    const res = await request(app)
      .get("/users?page=1&limit=5");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("meta");
    expect(res.body.data.meta.total).toBe(1);
    expect(res.body.data.meta.page).toBe(1);
    expect(res.body.data.meta.limit).toBe(5);
    expect(Array.isArray(res.body.data.result)).toBe(true);
    expect(res.body.data.result.length).toBe(1);
  });

  it("should fetch a single user by ID", async () => {
    const usersRes = await request(app).get("/users");
    const userId = usersRes.body.data.result[0].id;

    const res = await request(app).get(`/users/${userId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(userId);
  });

  it("should update user successfully including profilePic", async () => {
    const usersRes = await request(app).get("/users");
    const userId = usersRes.body.data.result[0].id;

    const res = await request(app)
      .put(`/users/${userId}`)
      .send({
        name: "Updated Name",
        profilePic: "https://picsum.photos/300",
      });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Name");
    expect(res.body.data.profilePic).toBe("https://picsum.photos/300");
  });

  it("should cascade delete related posts, comments, and likes when user is deleted", async () => {
    // 1. Create a user
    const user = await prisma.user.create({
      data: { email: "cascade-user@example.com", name: "Cascade User" },
    });

    // 2. Create a post by user
    const post = await prisma.post.create({
      data: { title: "Cascade Post", authorId: user.id },
    });

    // 3. Create a comment by user on post
    const comment = await prisma.comment.create({
      data: { content: "Cascade Comment", postId: post.id, authorId: user.id },
    });

    // 4. Create a like by user on post
    const like = await prisma.like.create({
      data: { postId: post.id, userId: user.id },
    });

    // Delete user
    const res = await request(app).delete(`/users/${user.id}`);
    expect(res.status).toBe(200);

    // Verify cascade deletes
    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    const dbPost = await prisma.post.findUnique({ where: { id: post.id } });
    const dbComment = await prisma.comment.findUnique({ where: { id: comment.id } });
    const dbLike = await prisma.like.findUnique({
      where: { postId_userId: { postId: post.id, userId: user.id } },
    });

    expect(dbUser).toBeNull();
    expect(dbPost).toBeNull();
    expect(dbComment).toBeNull();
    expect(dbLike).toBeNull();
  });
});
