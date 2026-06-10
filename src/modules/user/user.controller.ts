import { Request, Response } from "express";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.email) {
      return res.status(400).json({ error: "Email is required" });
    }
    const user = await userService.createUser({
      email: body.email,
      name: body.name || null,
    });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const body = req.body;
    const user = await userService.updateUser(userId, {
      email: body.email,
      name: body.name,
    });
    res.status(200).json(user);
  } catch (error: any) {
    const status = error.code === "P2025" ? 404 : 500;
    res.status(status).json({ error: error.message || error });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    await userService.deleteUser(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error: any) {
    const status = error.code === "P2025" ? 404 : 500;
    res.status(status).json({ error: error.message || error });
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
