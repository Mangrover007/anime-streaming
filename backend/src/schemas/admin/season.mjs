import { z } from "zod";

export const seasonCreateSchema = z.object({
  animeName: z.string().nonempty(),
  isFinished: z.boolean(),
  startedAiring: z.coerce.date().nullable().optional(),
  finishedAiring: z.coerce.date().nullable().optional(),
});

export const seasonPatchSchema = z.object({
  seasonId: z.coerce.number().int().gt(0).nonoptional(),
  animeId: z.coerce.number().int().gt(0).optional(),
  seasonNumber: z.coerce.number().int().gt(0).optional(),
  isFinished: z.boolean().optional(),
  startedAiring: z.coerce.date().nullable().optional(),
  finishedAiring: z.coerce.date().nullable().optional(),
});

export const seasonDeleteSchema = z.object({
  seasonId: z.coerce.number().int().gt(0),
});
