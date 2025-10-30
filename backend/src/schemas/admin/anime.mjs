import { z } from "zod";


export const adminAnimePostSchema = z.object({
    title: z.string().nonempty(),
    description: z.string(),
    rating: z.coerce.number().gt(0),
    author: z.string().nonempty(),
    startedAiring: z.coerce.date(),
    finishedAiring: z.coerce.date().nullable(),
    status: z.enum(["HIATUS", "AIRING", "FINISHED", "UPCOMING"]),
    thumbnailUrl: z.url(),
});


export const adminAnimeDeleteSchema = z.object({
    animeId: z.coerce.number().int().gt(0),
});


export const adminAnimePatchSchema = z.object({
    animeId: z.coerce.number().int().gt(0).nonoptional(),
    title: z.string().nonempty().optional(),
    description: z.string().optional(),
    rating: z.coerce.number().gt(0).optional(),
    author: z.string().nonempty().optional(),
    startedAiring: z.coerce.date().optional(),
    finishedAiring: z.preprocess(data => { return data === "" ? null : new Date(data) }, z.date().nullable().optional()),
    status: z.enum(["HIATUS", "AIRING", "FINISHED", "UPCOMING"]).optional(),
    thumbnailUrl: z.url().optional(),
});
