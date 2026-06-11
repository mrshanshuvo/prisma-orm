import { z } from "zod";

// Validation Schema - CREATE single Post
const createPostSchema = z.object({
  title: z
    .string({
      message: "Title is required",
    })
    .min(1, "Title cannot be empty"),
  content: z.string().nullable().optional(),
  published: z.boolean().optional(),
  authorId: z.number({
    message: "Author ID is required",
  }),
});

// Validation Schema - UPDATE single Post
const updatePostSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  content: z.string().nullable().optional(),
  published: z.boolean().optional(),
  authorId: z.number().optional(),
});

export const postValidation = {
  createPostSchema,
  updatePostSchema,
};
