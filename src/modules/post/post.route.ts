import { Router } from "express";
import { postController } from "./post.controller";

const router = Router();

// 1. GET /posts - get all posts
router.get("/posts", postController.getAllPosts);

// 2. GET /posts/:id - get single post
router.get("/posts/:id", postController.getPostById);

// 3. POST /posts - create post
router.post("/posts", postController.createPost);

// 4. PUT /posts/:id - update post
router.put("/posts/:id", postController.updatePost);

// 5. DELETE /posts/:id - delete post
router.delete("/posts/:id", postController.deletePost);

export { router as postRoutes };
