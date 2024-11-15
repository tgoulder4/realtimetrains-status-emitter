import { z } from 'zod'

export const StationSchema = z.object({
  code: z.string().length(3),
  name: z.string()
})

export const PlatformSchema = z.object({
  number: z.string()
})

export type Station = z.infer<typeof StationSchema>
export type Platform = z.infer<typeof PlatformSchema>