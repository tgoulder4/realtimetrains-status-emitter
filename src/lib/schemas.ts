import { error } from "console";
import { z } from "zod";

export const statusUpdateSchema = z.object({ status: z.string(), platform: z.number() })

export const TrackStateSchema = z.object({
    data: z.object({
        status: z.enum(["Wait", "Go", "Changed", "Error", "Prepare"]),
        platform: z.object({ number: z.string(), type: z.enum(["confirmedAndChanged", "confirmedAndNotChanged", "expected"]) }),
        scheduledDepartureTime: z.string(),
        destination: z.object({ name: z.string(), code: z.string() }),
        provider: z.string()
    }),
    hidden: z.object({
        timeTillRefresh: z.number(),
        error: z.any().optional(),
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