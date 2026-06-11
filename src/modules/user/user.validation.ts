import { z } from "zod";

// Validation Schema - CREATE single User
const createUserSchema = z.object({
  email: z.email({ message: "Invalid email format" }),
  name: z.string().nullable().optional(),
});

// Validation Schema - UPDATE single User
const updateUserSchema = z.object({
  email: z.email({ message: "Invalid email format" }).optional(),
  name: z.string().nullable().optional(),
});

export const userValidation = {
  createUserSchema,
  updateUserSchema,
};
