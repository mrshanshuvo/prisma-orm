import prisma from "../../config/db";
import { NotFoundError } from "../../utils/errors";

// CRUD - CREATE single Comment
const createCommentInDB = async (payload: {
  content: string;
  postId: number;
  authorId: number;
}) => {
  const user = await prisma.user.findUnique({
    where: { id: payload.authorId },
  });
  if (!user) throw new NotFoundError("User not found");

  const post = await prisma.post.findUnique({ where: { id: payload.postId } });
  if (!post) throw new NotFoundError("Post not found");

  return await prisma.comment.create({
    data: {
      content: payload.content,
      postId: payload.postId,
      authorId: payload.authorId,
    },
  });
};

// CRUD - READ all Comments
const getAllCommentsFromDB = async (options: {
  page: number;
  limit: number;
  postId?: number;
  authorId?: number;
}) => {
  const { page, limit, postId, authorId } = options;
  const skip = (page - 1) * limit;
  const take = limit;

  const where: any = {};

  if (postId !== undefined) {
    where.postId = postId;
  }

  if (authorId !== undefined) {
    where.authorId = authorId;
  }

  const [total, result] = await prisma.$transaction([
    prisma.comment.count({ where }),
    prisma.comment.findMany({
      where,
      skip,
      take,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
    result,
  };
};

// CRUD - READ single Comment
const getCommentFromDB = async (id: number) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });
  if (!comment) throw new NotFoundError("Comment not found");
  return comment;
};

// CRUD - UPDATE single Comment
const updateCommentInDB = async (
  id: number,
  data: {
    content: string;
    postId: number;
    authorId: number;
  },
) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new NotFoundError("Comment not found");

  if (data.authorId !== undefined) {
    const user = await prisma.user.findUnique({ where: { id: data.authorId } });
    if (!user) throw new NotFoundError("User not found");
  }

  if (data.postId !== undefined) {
    const post = await prisma.post.findUnique({ where: { id: data.postId } });
    if (!post) throw new NotFoundError("Post not found");
  }

  return await prisma.comment.update({
    where: { id },
    data,
  });
};

// CRUD - DELETE single Commnet
const deleteCommentFromDB = async (id: number) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new NotFoundError("Comment not found");

  return await prisma.comment.delete({
    where: { id },
  });
};

export const commentService = {
  createCommentInDB,
  getAllCommentsFromDB,
  getCommentFromDB,
  updateCommentInDB,
  deleteCommentFromDB,
};
