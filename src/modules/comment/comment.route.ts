import { Router } from "express";
import { commentController } from "./comment.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { commentValidation } from "./comment.validation";

const router = Router();

// 1. POST /comments - Create a comment
router.post(
  "/comments",
  validateRequest(commentValidation.createCommentSchema),
  commentController.createComment,
);

// 2. GET /comments - Get all comments
router.get("/comments", commentController.getAllComments);

// 3. GET /comments/:id - Get single comment
router.get("/comments/:id", commentController.getComment);

// 4. PUT /comments/:id - Update comment
router.put(
  "/comments/:id",
  validateRequest(commentValidation.updateCommentSchema),
  commentController.updateComment,
);

// 5. DELETE /comments/:id - Delete comment
router.delete("/comments/:id", commentController.deleteComment);

export { router as commentRoutes };
