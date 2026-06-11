import prisma from "../../config/db";

const getAllPostsFromDB = async () => {
  return await prisma.post.findMany({
    include: {
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });
};

const getPostByIdFromDB = async (id: number) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: true,
      likes: true,
    },
  });
  if (!post) throw new Error("Post not found");
  return post;
};

const createPostInDB = async (data: {
  title: string;
  content?: string | null;
  published?: boolean;
  authorId: number;
}) => {
  const user = await prisma.user.findUnique({
    where: { id: data.authorId },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      published: data.published,
      authorId: data.authorId,
    },
  });
};

const updatePostByIdInDB = async (
  id: number,
  data: {
    title?: string;
    content?: string | null;
    published?: boolean;
    authorId?: number;
  },
) => {
  if (data.authorId !== undefined) {
    const user = await prisma.user.findUnique({
      where: { id: data.authorId },
    });
    if (!user) {
      throw new Error("User not found");
    }
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");

  return await prisma.post.update({
    where: { id },
    data,
  });
};

const deletePostByIdInDB = async (id: number) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new Error("Post not found");

  return await prisma.post.delete({
    where: { id },
  });
};

export const postService = {
  getAllPostsFromDB,
  getPostByIdFromDB,
  createPostInDB,
  updatePostByIdInDB,
  deletePostByIdInDB,
};
