import { z } from "zod";

export const commentDeleteSchema = z.object({
  commentId: z.coerce.number().int().gt(0)
});
