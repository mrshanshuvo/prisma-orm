import prisma from "../../config/db";

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new Error("User not found");
  return user;
};

const createUser = async (data: { email: string; name?: string | null }) => {
  return await prisma.user.create({
    data,
  });
};
const updateUser = async (
  id: number,
  data: { email?: string; name?: string | null },
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  return await prisma.user.update({
    where: { id },
    data,
  });
};
const deleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  return await prisma.user.delete({
    where: { id },
  });
};

export const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
