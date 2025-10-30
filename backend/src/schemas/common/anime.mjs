import { z } from "zod";

export const getAnimeSchema = z.object({
    p: z.coerce.number().int().gt(0).default(1),
    q: z.string().default("")
});


export const getAnimeByNameSchema = z.object({
    title: z.string().nonempty()
});
