import { z } from "zod";

export const DepartureStateSchema = z.object({
  status: z.enum(["Prepare", "Wait", "Go", "Unknown"]),
  platform: z.object({
    number: z.string(),
  }),
  scheduledDepartureTime: z.string(),
  destination: z.object({
    code: z.string(),
    name: z.string(),
  }),
  callingAt: z.array(z.object({
    code: z.string(),
    name: z.string(),
  })),
  provider: z.string(),
});

export type DepartureState = z.infer<typeof DepartureStateSchema>;