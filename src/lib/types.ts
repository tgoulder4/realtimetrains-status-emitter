import { z } from "zod"
import { TrackStateSchema } from "./schemas"

export type Service = {
    status: string,
    platform: z.infer<typeof TrackStateSchema>["data"]["platform"],
    scheduledDepartureTime: string,
    destination: { name: string, code: string },
    provider?: string
}
export type TrackState = z.infer<typeof TrackStateSchema>