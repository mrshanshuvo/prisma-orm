import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { postService } from "./post.service";
import { catchAsync } from "../../utils/catchAsync";
import { BadRequestError } from "../../utils/errors";

const getAllPosts = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const search = req.query.search as string;
  const authorId = req.query.authorId ? parseInt(req.query.authorId as string, 10) : undefined;
  const published = req.query.published !== undefined ? req.query.published === "true" : undefined;

  const result = await postService.getAllPostsFromDB({
    page,
    limit,
    search,
    authorId,
    published,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Success",
    data: result,
  });
});

const getPostById = catchAsync(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id as string, 10);
  if (isNaN(postId)) {
    throw new BadRequestError("Invalid post ID");
  }
  const post = await postService.getPostByIdFromDB(postId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Success",
    data: post,
  });
});

const createPost = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title) {
    throw new BadRequestError("Title is required");
  }
  if (!body.authorId) {
    throw new BadRequestError("Author ID is required");
  }
  const post = await postService.createPostInDB(body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Created successfully",
    data: post,
  });
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id as string, 10);
  if (isNaN(postId)) {
    throw new BadRequestError("Invalid post ID");
  }
  const body = req.body;
  const post = await postService.updatePostByIdInDB(postId, body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Updated successfully",
    data: post,
  });
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
  const postId = parseInt(req.params.id as string, 10);
  if (isNaN(postId)) {
    throw new BadRequestError("Invalid post ID");
  }
  const post = await postService.deletePostByIdInDB(postId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deleted successfully",
    data: post,
  });
});

export const postController = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
