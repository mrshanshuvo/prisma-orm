import multer from "multer";
import path from "path";
import fs from "fs";

import os from "os";

const isServerless = process.env.VERCEL === "1";
const uploadDir = isServerless ? os.tmpdir() : path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).trim().replace(/\s+/g, "");
    cb(null, uniqueSuffix + ext);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit for videos and photos
  },
});
