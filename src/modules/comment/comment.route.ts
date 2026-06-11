import { Router } from "express";
import { commentController } from "./comment.controller";

const router = Router();

router.post("/comments", commentController.createComment);
router.get("/comments", commentController.getAllComments);
router.get("/comments/:id", commentController.getComment);
router.put("/comments/:id", commentController.updateComment);
router.delete("/comments/:id", commentController.deleteComment);

export { router as commentRoutes };
