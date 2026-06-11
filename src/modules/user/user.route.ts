import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = Router();

// 1. GET /users - Get all users
router.get("/users", userController.getAllUsers);

// 2. POST /users - Create a user
router.post(
  "/users",
  validateRequest(userValidation.createUserSchema),
  userController.createUser,
);

// 3. GET /users/:id - Get single user
router.get("/users/:id", userController.getUserById);

// 4. PUT /users/:id - Update user
router.put(
  "/users/:id",
  validateRequest(userValidation.updateUserSchema),
  userController.updateUser,
);

// 5. DELETE /users/:id - Delete user
router.delete("/users/:id", userController.deleteUser);

export { router as userRoutes };
