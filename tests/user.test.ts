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
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.email).toBe("testuser@example.com");
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

  it("should return 404 if user not found", async () => {
    const res = await request(app).get("/users/99999");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });
});
