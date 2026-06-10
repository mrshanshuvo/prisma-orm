import prisma from "../../config/db";

const getAllUsers = async () => {
  return await prisma.user.findMany();
};

const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
  });
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
  return await prisma.user.update({
    where: { id },
    data,
  });
};
const deleteUser = async (id: number) => {
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
