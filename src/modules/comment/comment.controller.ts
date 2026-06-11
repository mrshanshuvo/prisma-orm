import { Request, Response } from "express";
import { commentService } from "./comment.service";

// CRUD - CREATE single Comment
const createComment = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const comment = await commentService.createCommentInDB(payload);
    res.status(201).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

// CRUD - READ all Comments
const getAllComments = async (req: Request, res: Response) => {
  try {
    const comments = await commentService.getAllCommentsFromDB();
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

// CRUD - READ single Comment
const getComment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const comment = await commentService.getCommentFromDB(id);
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

// CRUD - UPDATE single Comment
const updateComment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const data = req.body;
    const comment = await commentService.updateCommentInDB(id, data);
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(500).json({
      error: error.message || error,
    });
  }
};

// CRUD - DELETE single Commnet
const deleteComment = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const comment = await commentService.deleteCommentFromDB(id);
    res.status(200).json(comment);
  } catch (error: any) {
    res.status(500).json({
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
