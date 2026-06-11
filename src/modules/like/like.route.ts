import { Router } from "express";
import { likeController } from "./like.controller";

const router = Router();

router.get("/likes", likeController.getAllLikes);
router.get("/likes/:id", likeController.getLike);
router.post("/likes", likeController.toggleLike);

export { router as likeRoutes };
