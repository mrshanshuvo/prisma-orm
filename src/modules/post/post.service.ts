import prisma from "../../config/db";
import { NotFoundError } from "../../utils/errors";

// CRUD - READ all Posts
const getAllPostsFromDB = async (options: {
  page: number;
  limit: number;
  search?: string;
  authorId?: number;
  published?: boolean;
}) => {
  const { page, limit, search, authorId, published } = options;
  const skip = (page - 1) * limit;
  const take = limit;

  const where: any = {};

  if (authorId !== undefined) {
    where.authorId = authorId;
  }

  if (published !== undefined) {
    where.published = published;
  }

  if (search) {
    where.OR = [
      {
        title: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        content: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  const [total, result] = await prisma.$transaction([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take,
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
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

// CRUD - READ single Post
const getPostByIdFromDB = async (id: number) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: true,
      likes: true,
    },
  });
  if (!post) throw new NotFoundError("Post not found");
  return post;
};

// CRUD - CREATE single Post
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
    throw new NotFoundError("User not found");
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

// CRUD - UPDATE single Post
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
      throw new NotFoundError("User not found");
    }
  }

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new NotFoundError("Post not found");

  return await prisma.post.update({
    where: { id },
    data,
  });
};

// CRUD - DELETE single Post
const deletePostByIdInDB = async (id: number) => {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) throw new NotFoundError("Post not found");

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
