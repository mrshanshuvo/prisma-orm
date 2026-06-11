import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { postService } from "./post.service";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await postService.getAllPostsFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Success",
      data: posts,
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

const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string, 10);
    if (isNaN(postId)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid user ID",
        error: "Invalid user ID",
      });
    }
    const post = await postService.getPostByIdFromDB(postId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Success",
      data: post,
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

const createPost = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const post = await postService.createPostInDB(body);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Created successfully",
      data: post,
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

const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string, 10);
    if (isNaN(postId)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid user ID",
        error: "Invalid user ID",
      });
    }
    const body = req.body;
    const post = await postService.updatePostByIdInDB(postId, body);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Updated successfully",
      data: post,
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

const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string, 10);
    if (isNaN(postId)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Invalid user ID",
        error: "Invalid user ID",
      });
    }
    const post = await postService.deletePostByIdInDB(postId);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Deleted successfully",
      data: post,
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

export const postController = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
