import { z } from "zod";

export const getAnimeSchema = z.object({
    pageNumber: z.coerce.number().int().gt(0).default(1),
    query: z.string().default("")
});


export const getAnimeByNameSchema = z.object({
    title: z.string().nonempty()
});
