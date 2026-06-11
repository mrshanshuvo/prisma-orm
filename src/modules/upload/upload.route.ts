import { Router } from "express";
import { upload } from "../../middlewares/upload";
import { uploadController } from "./upload.controller";

const router = Router();

router.post(
  "/upload/single",
  upload.single("file"),
  uploadController.uploadSingle,
);
router.post(
  "/upload/multiple",
  upload.array("files", 10),
  uploadController.uploadMultiple,
);

export { router as uploadRoutes };
