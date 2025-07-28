import { z } from 'zod'
import { DepartureStateSchema } from './states'

//extend departurestateschema with remainingCredits: z.number().int().nonnegative(),
export const TrackStatusResponseSchema = DepartureStateSchema.extend({
  remainingCredits: z.number().int().nonnegative(),
  tId: z.string().length(4),
})

export const TrackStatusParamsSchema = z.object({
  //origin 3 letter capital letter code
  origin: z.string().regex(/^[A-Z]{3}$/),
  departureId: z.string().regex(/^[A-Z0-9]{4}$/),
})

export const FindServicesParamsSchema = z.object({
  //origin 3 letter capital letter code
  origin: z.string().regex(/^[A-Z]{3}$/),
})
export type TrackStatusResponse = z.infer<typeof TrackStatusResponseSchema>
export type TrackStatusParams = z.infer<typeof TrackStatusParamsSchema>
export type FindServicesParams = z.infer<typeof FindServicesParamsSchema>