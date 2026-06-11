import { z } from "zod";

// Validation Schema - TOGGLE single Like
const toggleLikeSchema = z.object({
  postId: z.number({
    message: "Post ID is required",
  }),
  userId: z.number({
    message: "User ID is required",
  }),
});

export const likeValidation = {
  toggleLikeSchema,
};
