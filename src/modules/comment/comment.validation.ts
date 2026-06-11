import { z } from "zod";

// Validation Schema - CREATE single Comment
const createCommentSchema = z.object({
  content: z
    .string({
      message: "Content is required",
    })
    .min(1, "Content cannot be empty"),
  postId: z.number({
    message: "Post ID is required",
  }),
  authorId: z.number({
    message: "Author ID is required",
  }),
});

// Validation Schema - UPDATE single Comment
const updateCommentSchema = z.object({
  content: z.string().min(1, "Content cannot be empty").optional(),
  postId: z.number().optional(),
  authorId: z.number().optional(),
});

export const commentValidation = {
  createCommentSchema,
  updateCommentSchema,
};
