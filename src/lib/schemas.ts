import { z } from "zod";

export const statusUpdateSchema = z.object({ status: z.string(), platform: z.number() })