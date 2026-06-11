import prisma from "../../config/db";
import { NotFoundError } from "../../utils/errors";

// CRUD - READ all Users
const getAllUsers = async (options: { page: number; limit: number }) => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;
  const take = limit;

  const [total, result] = await prisma.$transaction([
    prisma.user.count(),
    prisma.user.findMany({
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

// CRUD - READ single User
const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  if (!user) throw new NotFoundError("User not found");
  return user;
};

// CRUD - CREATE single User
const createUser = async (data: {
  email: string;
  name?: string | null;
  profilePic?: string | null;
}) => {
  return await prisma.user.create({
    data,
  });
};

// CRUD - UPDATE single User
const updateUser = async (
  id: number,
  data: { email?: string; name?: string | null; profilePic?: string | null },
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User not found");

  return await prisma.user.update({
    where: { id },
    data,
  });
};

// CRUD - DELETE single User
const deleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new NotFoundError("User not found");

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
