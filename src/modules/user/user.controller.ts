import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Success",
      data: users,
    });
  } catch (error: any) {
    const isNotFound = error.message && error.message.includes("not found");
    sendResponse(res, {
      statusCode: isNotFound ? 404 : 500,
      success: false,
      message: isNotFound ? "Not Found" : "Internal Server Error",
      error: error.message || error,
    });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    if (isNaN(userId)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid user ID",
        error: "Invalid user ID",
      });
    }
    const user = await userService.getUserById(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Success",
      data: user,
    });
  } catch (error: any) {
    const isNotFound = error.message && error.message.includes("not found");
    sendResponse(res, {
      statusCode: isNotFound ? 404 : 500,
      success: false,
      message: isNotFound ? "Not Found" : "Internal Server Error",
      error: error.message || error,
    });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.email) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Email is required",
        error: "Email is required",
      });
    }
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
  } catch (error: any) {
    const isNotFound = error.message && error.message.includes("not found");
    sendResponse(res, {
      statusCode: isNotFound ? 404 : 500,
      success: false,
      message: isNotFound ? "Not Found" : "Internal Server Error",
      error: error.message || error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    if (isNaN(userId)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid user ID",
        error: "Invalid user ID",
      });
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
  } catch (error: any) {
    const isNotFound = error.message && error.message.includes("not found");
    sendResponse(res, {
      statusCode: isNotFound ? 404 : 500,
      success: false,
      message: isNotFound ? "Not Found" : "Internal Server Error",
      error: error.message || error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id as string, 10);
    if (isNaN(userId)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid user ID",
        error: "Invalid user ID",
      });
    }
    await userService.deleteUser(userId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    const isNotFound = error.message && error.message.includes("not found");
    sendResponse(res, {
      statusCode: isNotFound ? 404 : 500,
      success: false,
      message: isNotFound ? "Not Found" : "Internal Server Error",
      error: error.message || error,
    });
  }
};

export const userController = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
