import { z } from "zod";

export const protectedAnimeGetFavoriteSchema = z.object({
    userId: z.coerce.number().int().gt(0),
});

export const protectedAnimePostFavoriteSchema = z.object({
    animeId: z.coerce.number().int().gt(0),
    userId: z.coerce.number().int().gt(0),
});

export const protectedAnimeDeleteFavoriteSchema = z.object({
    animeId: z.coerce.number().int().gt(0),
    userId: z.coerce.number().int().gt(0),
});
