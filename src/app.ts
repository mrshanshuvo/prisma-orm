import express from "express";
import { userRoutes } from "./modules/user/user.route";
import { postRoutes } from "./modules/post/post.route";
import { commentRoutes } from "./modules/comment/comment.route";
import { likeRoutes } from "./modules/like/like.route";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());

// Health check / Root
app.get("/", async (req, res) => {
  try {
    res.status(200).json({
      message: "Welcome to the Gyan Prisma Server!",
      databaseStatus: "Connected",
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Welcome to the Gyan Prisma Server!",
      databaseStatus: "Error connecting to database",
      error: error.message || error,
    });
  }
});

// Register routes
app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/", commentRoutes);
app.use("/", likeRoutes);

// Route not found (Fallback)
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// Global Error Handler
app.use(errorHandler);

export default app;
