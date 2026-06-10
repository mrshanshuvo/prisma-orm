import express from "express";
import { userRoutes } from "./modules/user/user.route";
import { postRoutes } from "./modules/post/post.route";

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

// Route not found (Fallback)
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

export default app;
