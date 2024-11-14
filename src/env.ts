import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        NODE_ENV: z.string().optional(),
        SCRAPEOPS_API_KEY: z.string(),
        prod_override_true_if_nonempty: z.string().optional(),
        EMAIL_FROM: z.string(),
        EMAIL_SERVER_PASSWORD: z.string().min(1),
        APP_URL: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
        NEXT_PUBLIC_POSTHOG_HOST: z.string().min(1),
    },
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        SCRAPEOPS_API_KEY: process.env.SCRAPEOPS_API_KEY,
        prod_override_true_if_nonempty: process.env.prod_override_true_if_nonempty,
        EMAIL_FROM: process.env.EMAIL_FROM,
        EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
        NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
        NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        APP_URL: process.env.APP_URL,
        // HOST_NAME: process.env.HOST_NAME
    },
});
