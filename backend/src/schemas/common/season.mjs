import { z } from "zod";

export const getSeasonSchema = z.object({
    title: z.string().nonempty()
});
