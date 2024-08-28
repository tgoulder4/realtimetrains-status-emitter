import { error } from "console";
import { z } from "zod";

export const statusUpdateSchema = z.object({ status: z.string(), platform: z.number() })

export const TrackStateSchema = z.object({
    data: z.object({
        status: z.enum(["Loading", "Wait", "Go", "Changed", "Error", "Prepare"]),
        platform: z.object({ number: z.string() }),
        scheduledDepartureTime: z.string(),
        destination: z.object({ name: z.string(), code: z.string() }),
        provider: z.string()
    }),
    hidden: z.object({
        timeTilRefresh: z.number(),
        timeWhenPollingStarts: z.string().length(4).optional(),
        error: z.any().optional(),
        updateKey: z.string()
    })
})
export const JourneySchema = z.object({
    departure: z.object({
        code: z.string(),
        time: z.string(),
        name: z.string(),
    }),
    aimStation: z.object({
        code: z.string(),
        name: z.string(),
    }).optional()
})