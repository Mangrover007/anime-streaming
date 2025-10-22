import { z } from "zod";

export const getEpisodeByIdSchema = z.object({
    episodeId: z.coerce.number().int().gt(0)
})

export const getEpisodesBySeasonSchema = z.object({
    seasonId: z.coerce.number().int().gt(0)
})
