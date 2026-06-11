import prisma from "../../config/db";

const getAllLikesFromDB = async () => {
  return await prisma.like.findMany();
};

const getLikeFromDB = async (id: number) => {
  const like = await prisma.like.findUnique({
    where: { id },
  });

  if (!like) {
    throw new Error("Like not found");
  }

  return like;
};

const toggleLikeInDB = async (data: { postId: number; userId: number }) => {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });
  if (!user) {
    throw new Error("User not found");
  }

  const post = await prisma.post.findUnique({
    where: { id: data.postId },
  });
  if (!post) {
    throw new Error("Post not found");
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
