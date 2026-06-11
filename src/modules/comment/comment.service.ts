import prisma from "../../config/db";

// CRUD - CREATE single Comment
const createCommentInDB = async (payload: {
  content: string;
  postId: number;
  authorId: number;
}) => {
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
  return await prisma.comment.findMany({
    where: { id: id },
  });
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
  return await prisma.comment.update({
    where: { id },
    data,
  });
};

// CRUD - DELETE single Commnet
const deleteCommentFromDB = async (id: number) => {
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
