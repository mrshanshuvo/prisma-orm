import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { likeService } from "./like.service";
import { catchAsync } from "../../utils/catchAsync";
import { BadRequestError } from "../../utils/errors";

const getAllLikes = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const postId = req.query.postId ? parseInt(req.query.postId as string, 10) : undefined;
  const userId = req.query.userId ? parseInt(req.query.userId as string, 10) : undefined;

  const result = await likeService.getAllLikesFromDB({
    page,
    limit,
    postId,
    userId,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Success",
    data: result,
  });
});

const getLike = catchAsync(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string, 10);
  if (isNaN(id)) {
    throw new BadRequestError("Invalid like ID");
  }
  const like = await likeService.getLikeFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Success",
    data: like,
  });
});

const toggleLike = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  if (!data.postId) {
    throw new BadRequestError("Post ID is required");
  }
  if (!data.userId) {
    throw new BadRequestError("User ID is required");
  }
  const result = await likeService.toggleLikeInDB(data);
  const isCreated = result.action === "created";

  sendResponse(res, {
    statusCode: isCreated ? 201 : 200,
    success: true,
    message: isCreated ? "Created successfully" : "Deleted successfully",
    data: result.like,
  });
});

export const likeController = {
  getAllLikes,
  getLike,
  toggleLike,
};
