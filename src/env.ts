import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        NODE_ENV: z.string().optional(),
        SCRAPEOPS_API_KEY: z.string(),
        // HOST_NAME: z.string().min(1),
    },
    client: {},
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        SCRAPEOPS_API_KEY: process.env.SCRAPEOPS_API_KEY,
        // HOST_NAME: process.env.HOST_NAME
    },
});
