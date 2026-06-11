import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { userService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { BadRequestError } from "../../utils/errors";

// CRUD - READ all Users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const result = await userService.getAllUsers({ page, limit });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Success",
    data: result,
  });
});

// CRUD - READ single User
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id as string, 10);
  if (isNaN(userId)) {
    throw new BadRequestError("Invalid user ID");
  }
  const user = await userService.getUserById(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Success",
    data: user,
  });
});

// CRUD - CREATE single User
const createUser = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const user = await userService.createUser({
    email: body.email,
    name: body.name || null,
  });
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Created successfully",
    data: user,
  });
});

// CRUD - UPDATE single User
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id as string, 10);
  if (isNaN(userId)) {
    throw new BadRequestError("Invalid user ID");
  }
  const body = req.body;
  const user = await userService.updateUser(userId, {
    email: body.email,
    name: body.name,
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Updated successfully",
    data: user,
  });
});

// CRUD - DELETE single User
const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id as string, 10);
  if (isNaN(userId)) {
    throw new BadRequestError("Invalid user ID");
  }
  await userService.deleteUser(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deleted successfully",
  });
});

export const userController = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
