import { Request, Response } from "express";
import { postService } from "./post.service";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await postService.getAllPostsFromDB();
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const post = await postService.getPostByIdFromDB(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const post = await postService.createPostInDB(body);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

const updatePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const body = req.body;
    const post = await postService.updatePostByIdInDB(postId, body);
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.id as string, 10);
    if (isNaN(postId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    const post = await postService.deletePostByIdInDB(postId);
    res.status(200).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message || error });
  }
};

export const postController = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
