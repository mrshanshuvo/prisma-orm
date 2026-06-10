import app from "./app";
import { initDB } from "./config/db";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 1. initialize/verify database connection
    await initDB();

    // 2. start server
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to start server due to database connection error:",
      error,
    );
    process.exit(1);
  }
};

startServer();
