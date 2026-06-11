import prisma from "../../config/db";

// CRUD - CREATE single Comment
const createCommentInDB = async (payload: {
  content: string;
  postId: number;
  authorId: number;
}) => {
  const user = await prisma.user.findUnique({
    where: { id: payload.authorId },
  });
  if (!user) throw new Error("User not found");

  const post = await prisma.post.findUnique({ where: { id: payload.postId } });
  if (!post) throw new Error("Post not found");

  return await prisma.comment.create({
    data: {
      content: payload.content,
      postId: payload.postId,
      authorId: payload.authorId,
    },
  });
};

// CRUD - READ all Comments
const getAllCommentsFromDB = async () => {
  return await prisma.comment.findMany();
};

// CRUD - READ single Comment
const getCommentFromDB = async (id: number) => {
  const comment = await prisma.comment.findUnique({
    where: { id },
  });
  if (!comment) throw new Error("Comment not found");
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
  if (!comment) throw new Error("Comment not found");

  if (data.authorId !== undefined) {
    const user = await prisma.user.findUnique({ where: { id: data.authorId } });
    if (!user) throw new Error("User not found");
  }

  if (data.postId !== undefined) {
    const post = await prisma.post.findUnique({ where: { id: data.postId } });
    if (!post) throw new Error("Post not found");
  }

  return await prisma.comment.update({
    where: { id },
    data,
  });
};

// CRUD - DELETE single Commnet
const deleteCommentFromDB = async (id: number) => {
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) throw new Error("Comment not found");

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
