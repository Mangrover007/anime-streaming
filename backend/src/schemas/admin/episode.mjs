import { z } from "zod";

export const episodeCreateSchema = z.object({
    seasonId: z.coerce.number().int().gt(0),
    title: z.string().min(1),
    length: z.coerce.number().int().gt(0),
    airedAt: z.coerce.date(),
    subUrl: z.url(),
});

export const episodePatchSchema = z.object({
    episodeId: z.coerce.number().int().gt(0).nonoptional(),
    title: z.string().min(1).optional(),
    episodeNumber: z.coerce.number().int().gt(0).optional(),
    length: z.coerce.number().int().gt(0).optional(),
    airedAt: z.coerce.date().optional(),
    subUrl: z.url().optional(),
    seasonId: z.coerce.number().int().gt(0).optional(),
});

export const episodeDeleteSchema = z.object({
    episodeId: z.coerce.number().int().gt(0)
});
 