import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// 2. GET /users - Get all users
router.get("/users", userController.getAllUsers);

// 3. POST /users - Create a user
router.post("/users", userController.createUser);

// 4. GET /users/:id - Get single user
router.get("/users/:id", userController.getUserById);

// 5. PUT /users/:id - Update user
router.put("/users/:id", userController.updateUser);

// 6. DELETE /users/:id - Delete user
router.delete("/users/:id", userController.deleteUser);

export { router as userRoutes };
