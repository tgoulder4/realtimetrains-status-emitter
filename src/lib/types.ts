import { z } from "zod"
import { TrackStateSchema } from "./schemas"

export type Service = {
    status: string,
    platform: string,
    scheduledDepartureTime: string,
    destinationStationName: string,
    destinationStationCode: string,
    provider?: string
}
export type TrackState = z.infer<typeof TrackStateSchema>