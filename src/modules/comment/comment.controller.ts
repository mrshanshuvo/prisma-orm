import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { commentService } from "./comment.service";

// CRUD - CREATE single Comment
const createComment = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const comment = await commentService.createCommentInDB(payload);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Created successfully",
      data: comment,
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

// CRUD - READ all Comments
const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await commentService.getAllCommentsFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Success",
      data: comments,
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

// CRUD - READ single Comment
const getComment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const comment = await commentService.getCommentFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Success",
      data: comment,
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

// CRUD - UPDATE single Comment
const updateComment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const data = req.body;
    const comment = await commentService.updateCommentInDB(id, data);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Updated successfully",
      data: comment,
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

// CRUD - DELETE single Commnet
const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const comment = await commentService.deleteCommentFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Deleted successfully",
      data: comment,
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

export const commentController = {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
};
