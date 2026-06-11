import { sendResponse } from "../../utils/sendResponse";
import { Request, Response } from "express";
import { likeService } from "./like.service";

const getAllLikes = async (req: Request, res: Response) => {
  try {
    const likes = await likeService.getAllLikesFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Success",
      data: likes,
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

const getLike = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const like = await likeService.getLikeFromDB(id);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Success",
      data: like,
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

const toggleLike = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const result = await likeService.toggleLikeInDB(data);
    const isCreated = result.action === "created";

    sendResponse(res, {
      statusCode: isCreated ? 201 : 200,
      success: true,
      message: isCreated ? "Created successfully" : "Deleted successfully",
      data: result.like,
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

export const likeController = {
  getAllLikes,
  getLike,
  toggleLike,
};
