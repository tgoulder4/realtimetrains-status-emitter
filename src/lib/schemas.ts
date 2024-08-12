import { error } from "console";
import { z } from "zod";

export const statusUpdateSchema = z.object({ status: z.string(), platform: z.number() })

export const TrackStateSchema = z.object({
    data: z.object({
        status: z.string(),
        platform: z.string(),
        platformHasChanged: z.boolean().optional(),
    }),
    hidden: z.object({
        timeTillRefresh: z.number(),
        error: z.any().optional(),
    })
})