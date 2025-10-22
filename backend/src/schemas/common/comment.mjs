import { z } from "zod";

export const getCommentSchema = z.object({
    episodeId: z.coerce.number().int().gt(0)
})
