import { Router } from "express";
import { likeController } from "./like.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { likeValidation } from "./like.validation";

const router = Router();

// 1. GET /likes - Get all likes
router.get("/likes", likeController.getAllLikes);

// 2. GET /likes/:id - Get single like
router.get("/likes/:id", likeController.getLike);

// 3. POST /likes - Toggle like
router.post(
  "/likes",
  validateRequest(likeValidation.toggleLikeSchema),
  likeController.toggleLike,
);

export { router as likeRoutes };
