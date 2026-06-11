import prisma from "../src/config/db";

export const cleanDatabase = async () => {
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.user.deleteMany({});
};
