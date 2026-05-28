import z from "zod";

export const LikeBlogBodySchema = z.object({
  userId: z.string().nonempty("User ID is required"),
});

export const LikeBlogParamsSchema = z.object({
  blogId: z.string().nonempty("Blog ID is required"),
});
