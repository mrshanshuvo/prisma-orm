import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { commentService } from "./comment.service";
import { catchAsync } from "../../utils/catchAsync";
import { BadRequestError } from "../../utils/errors";

// CRUD - CREATE single Comment
const createComment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  if (!payload.content) {
    throw new BadRequestError("Content is required");
  }
  if (!payload.postId) {
    throw new BadRequestError("Post ID is required");
  }
  if (!payload.authorId) {
    throw new BadRequestError("Author ID is required");
  }
  const comment = await commentService.createCommentInDB(payload);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Created successfully",
    data: comment,
  });
});

// CRUD - READ all Comments
const getAllComments = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const postId = req.query.postId ? parseInt(req.query.postId as string, 10) : undefined;
  const authorId = req.query.authorId ? parseInt(req.query.authorId as string, 10) : undefined;

  const result = await commentService.getAllCommentsFromDB({
    page,
    limit,
    postId,
    authorId,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Success",
    data: result,
  });
});

// CRUD - READ single Comment
const getComment = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    throw new BadRequestError("Invalid comment ID");
  }
  const comment = await commentService.getCommentFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Success",
    data: comment,
  });
});

// CRUD - UPDATE single Comment
const updateComment = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    throw new BadRequestError("Invalid comment ID");
  }
  const data = req.body;
  const comment = await commentService.updateCommentInDB(id, data);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Updated successfully",
    data: comment,
  });
});

// CRUD - DELETE single Commnet
const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    throw new BadRequestError("Invalid comment ID");
  }
  const comment = await commentService.deleteCommentFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Deleted successfully",
    data: comment,
  });
});

export const commentController = {
  createComment,
  getAllComments,
  getComment,
  updateComment,
  deleteComment,
};
