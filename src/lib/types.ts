import { z } from "zod"
import { TrackStateSchema } from "./schemas"

export type Service = {
    status: string,
    platform: string,
    departureTime: { delay: number, time: string },
    destinationStationName: string,
    stationCode: string,
    provider?: string
}
export type TrackState = z.infer<typeof TrackStateSchema>