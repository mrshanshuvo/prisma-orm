import prisma from "../../config/db";
import { NotFoundError } from "../../utils/errors";

const getAllLikesFromDB = async (options: {
  page: number;
  limit: number;
  postId?: number;
  userId?: number;
}) => {
  const { page, limit, postId, userId } = options;
  const skip = (page - 1) * limit;
  const take = limit;

  const where: any = {};

  if (postId !== undefined) {
    where.postId = postId;
  }

  if (userId !== undefined) {
    where.userId = userId;
  }

  const [total, result] = await prisma.$transaction([
    prisma.like.count({ where }),
    prisma.like.findMany({
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

const getLikeFromDB = async (id: number) => {
  const like = await prisma.like.findUnique({
    where: { id },
  });

  if (!like) {
    throw new NotFoundError("Like not found");
  }

  return like;
};

const toggleLikeInDB = async (data: { postId: number; userId: number }) => {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });
  if (!user) {
    throw new NotFoundError("User not found");
  }

  const post = await prisma.post.findUnique({
    where: { id: data.postId },
  });
  if (!post) {
    throw new NotFoundError("Post not found");
  }

  const existingLike = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId: data.postId,
        userId: data.userId,
      },
    },
  });

  if (existingLike) {
    const deletedLike = await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
    return { action: "deleted", like: deletedLike };
  }

  const createdLike = await prisma.like.create({
    data: {
      postId: data.postId,
      userId: data.userId,
    },
  });
  return { action: "created", like: createdLike };
};

export const likeService = {
  getAllLikesFromDB,
  getLikeFromDB,
  toggleLikeInDB,
};
