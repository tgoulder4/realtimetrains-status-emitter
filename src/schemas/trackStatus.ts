import { z } from 'zod'
import { DepartureStateSchema } from './departure'

export const TrackStatusResponseSchema = z.object({
  departureState: DepartureStateSchema,
  remainingCredits: z.number().int().nonnegative()
})

export const TrackStatusParamsSchema = z.object({
  destination: z.string().length(3),
  time: z.string().regex(/^T-\d{4}$/)
})

export type TrackStatusResponse = z.infer<typeof TrackStatusResponseSchema>
export type TrackStatusParams = z.infer<typeof TrackStatusParamsSchema>