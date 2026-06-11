# Express & Prisma Backend Architecture Guide

## ⚙️ Project Overview

This backend application is built using **Node.js**, **Express**, **TypeScript**, and **Prisma ORM** (with PostgreSQL via PG adapter). It follows a clean **modular Controller-Service-Route pattern**, ensuring a scalable, structured environment for writing robust API endpoints.

## 🏗️ Architecture Layers

### 1. **Entry & Server Configuration** (`/src/`)

- `server.ts`: The main entry point that initializes the database pool and starts the Express listening server.
- `app.ts`: Express application setup including built-in middlewares, router mounts, and the fallback 404 handler.

### 2. **Config Layer** (`/src/config/`)

Contains environment-specific configuration and initialization functions (e.g., initializing `PrismaClient` with connection pooling).

### 3. **Utils Layer** (`/src/utils/`)

Shared server-wide utility helper functions, including the centralized response handler.

### 4. **Modules Layer** (`/src/modules/`)

Contains feature-specific directories organized by domain (user, post, comment, like). Each module contains:

- `*.route.ts`: Route declarations and route-level middlewares.
- `*.controller.ts`: Handles Express Request/Response, calls services, sets HTTP status codes, and maps errors.
- `*.service.ts`: Houses business logic, interacts with the database via Prisma, and performs validations.

---

## 📂 Project Structure

```
src/
├── server.ts               # Server startup and DB initialization
├── app.ts                  # Express application setup
├── config/                 # Configurations
│   └── db.ts               # Prisma client and pool setup
├── middlewares/            # Express middlewares
│   ├── errorHandler.ts     # Global error handler
│   └── validateRequest.ts  # Zod schema validation middleware
├── utils/                  # Shared utility functions
│   ├── catchAsync.ts       # Async error wrapper
│   ├── errors.ts           # Custom error classes
│   └── sendResponse.ts     # Unified API response sender
└── modules/                # Feature-based modular structure
    ├── user/
    │   ├── user.route.ts
    │   ├── user.controller.ts
    │   ├── user.service.ts
    │   └── user.validation.ts
    ├── post/
    │   ├── post.route.ts
    │   ├── post.controller.ts
    │   ├── post.service.ts
    │   └── post.validation.ts
    ├── comment/
    │   ├── comment.route.ts
    │   ├── comment.controller.ts
    │   ├── comment.service.ts
    │   └── comment.validation.ts
    └── like/
        ├── like.route.ts
        ├── like.controller.ts
        ├── like.service.ts
        └── like.validation.ts
```

---

## 🎨 Response & Error System Implementation

### **1. Standardized JSON Responses**

**Strategy**: We strictly use the centralized `sendResponse` utility in all controller endpoints to ensure a uniform API contract. Ad-hoc `res.status().json()` calls are discouraged outside of the base app configuration.

**File**: `/src/utils/sendResponse.ts`

```typescript
import { Response } from "express";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: any;
};

export const sendResponse = <T>(res: Response, data: ApiResponse<T>) => {
  const responsePayload: any = {
    success: data.success,
    message: data.message,
  };

  if (data.data !== undefined) {
    responsePayload.data = data.data;
  }

  if (data.error !== undefined) {
    responsePayload.error = data.error;
  }

  res.status(data.statusCode).json(responsePayload);
};
```

**Usage in Controller**:

```typescript
sendResponse(res, {
  statusCode: 200,
  success: true,
  message: "Resource fetched successfully",
  data: result,
});
```

#### **Unified Pagination Response Contract**

**Strategy**: For listing endpoints, the `data` field always contains a `meta` metadata object detailing the total number of records, current page, limit per page, and total pages, alongside a `result` array.

**Response payload example**:
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "meta": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    },
    "result": [...]
  }
}
```

---

### **2. Service-Level Validations**

**Strategy**: Business logic and database integrity validations belong in the **Service Layer**. Before executing database writes, updates, deletions, or single-entity reads, services must verify entity existence and throw explicit custom error instances (e.g. `NotFoundError`).

**Patterns in Service**:

```typescript
import { NotFoundError } from "../../utils/errors";

// Check if the user exists
const user = await prisma.user.findUnique({
  where: { id: userId },
});
if (!user) {
  throw new NotFoundError("User not found");
}
```

---

### **3. Controller Error Handling & Mapping**

**Strategy**: Instead of verbose inline `try-catch` blocks inside controllers, we wrap all route handlers with the `catchAsync` utility. Errors thrown from the service layer (or input validations) are forwarded to the global error middleware automatically via `next()`.

**File**: `/src/modules/like/like.controller.ts` example:

```typescript
import { catchAsync } from "../../utils/catchAsync";
import { BadRequestError } from "../../utils/errors";

const getLike = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    throw new BadRequestError("Invalid like ID");
  }
  const like = await likeService.getLikeFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Success",
    data: like,
  });
});
```

---

### **4. Request Schema Validation (Zod)**

**Strategy**: We validate incoming payloads (`req.body`) using Zod schemas inside the routing layer. This keeps our controllers clean of manual presence/type checking.

**Middleware**: `/src/middlewares/validateRequest.ts`

**Example Validation Schema (`user.validation.ts`)**:
```typescript
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().nullable().optional(),
});

export const userValidation = {
  createUserSchema,
};
```

**Usage in Route**:
```typescript
router.post(
  "/users",
  validateRequest(userValidation.createUserSchema),
  userController.createUser,
);
```

---

## 🎮 Module Implementation Pattern

Each feature module is completely self-contained. The boundaries are strictly defined.

### **1. Service Pattern (Business Logic)**

Interacts with the database using PrismaClient and throws specific `AppError` subclasses for validation failures.

**Example**: `like.service.ts`

```typescript
import prisma from "../../config/db";
import { NotFoundError } from "../../utils/errors";

const getLikeFromDB = async (id: number) => {
  const like = await prisma.like.findUnique({
    where: { id },
  });

  if (!like) {
    throw new NotFoundError("Like not found");
  }

  return like;
};

const toggleLikeInDB = async (data: { postId: number; userId: number }) => {
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user) throw new NotFoundError("User not found");

  const post = await prisma.post.findUnique({ where: { id: data.postId } });
  if (!post) throw new NotFoundError("Post not found");

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: { postId: data.postId, userId: data.userId },
    },
  });

  if (existingLike) {
    const deletedLike = await prisma.like.delete({
      where: { id: existingLike.id },
    });
    return { action: "deleted", like: deletedLike };
  }

  const createdLike = await prisma.like.create({
    data: { postId: data.postId, userId: data.userId },
  });
  return { action: "created", like: createdLike };
};
```

### **2. Controller Pattern (Express Request Handler)**

Parses URL arguments / request body, validates presence of keys, and handles response delegation using `catchAsync`.

**Example**: `like.controller.ts`

```typescript
import { Request, Response } from "express";
import { likeService } from "./like.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { BadRequestError } from "../../utils/errors";

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  if (!data.postId) {
    throw new BadRequestError("Post ID is required");
  }
  if (!data.userId) {
    throw new BadRequestError("User ID is required");
  }
  const result = await likeService.toggleLikeInDB(data);
  const isCreated = result.action === "created";

  sendResponse(res, {
    statusCode: isCreated ? 201 : 200,
    success: true,
    message: isCreated ? "Created successfully" : "Deleted successfully",
    data: result.like,
  });
});
```

### **3. Route Pattern (Express Router)**

Maps paths/HTTP verbs to controller actions.

**Example**: `like.route.ts`

```typescript
import { Router } from "express";
import { likeController } from "./like.controller";

const router = Router();

router.get("/likes", likeController.getAllLikes);
router.get("/likes/:id", likeController.getLike);
router.post("/likes", likeController.toggleLike);

export { router as likeRoutes };
```

---

## 🧭 Server Initialization

### **1. Prisma Configuration**

Database configurations are centralized in `src/config/db.ts` utilizing connection pooling and modern PostgreSQL adapters.

**File**: `/src/config/db.ts`

```typescript
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const initDB = async () => {
  console.log("Connecting to the database...");
  await prisma.$connect();
  console.log("Database connected successfully.");
};

export default prisma;
```

### **2. Main Application Setup**

Routes are registered globally in the app context, with standard parser configurations and a fallback handler.

**File**: `/src/app.ts`

```typescript
import express from "express";
import { userRoutes } from "./modules/user/user.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { likeRoutes } from "./modules/like/like.route";

const app = express();

app.use(express.json());

// Routes registration
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", commentRoutes);
app.use("/", likeRoutes);

// Fallback Route
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default app;
```

---

## 🧪 Testing Suite

### **1. Test Configuration**
Integration tests are configured using **Jest** and **Supertest** with `ts-jest` for executing TypeScript tests.

- Config: `jest.config.ts`
- Script: `npm run test` or `npm test`

### **2. Testing Database Strategy**
Tests should clean the database before and after running using a shared helper. To run tests in isolation:
```typescript
import { cleanDatabase } from "./testHelpers";

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});
```

### **3. Writing Integration Tests**
Integration test files belong under the `/tests/` directory and match `*.test.ts`. They should test standard responses, validation middleware logic, and pagination schemas.
