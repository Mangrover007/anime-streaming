import { z } from "zod";

export const protectedCommentPostSchema = z.object({
  episodeId: z.coerce.number().int().gt(0),
  content: z.string().nonempty(),
});

export const protectedCommentPatchSchema = z.object({
  commentId: z.coerce.number().int().gt(0),
  userId: z.coerce.number().int().gt(0),
  content: z.string().nonempty(),
});

export const protectedCommentDeleteSchema = z.object({
  commentId: z.coerce.number().int().gt(0),
  userId: z.coerce.number().int().gt(0),
});
