import { z } from "zod"
import { JourneySchema, TrackStateSchema } from "./schemas"

export type Service = z.infer<typeof TrackStateSchema>["data"]
export type TrackState = z.infer<typeof TrackStateSchema>
export type Journey = z.infer<typeof JourneySchema>
export type UserSession = {
    id: UserId;
};
export type UserId = string;