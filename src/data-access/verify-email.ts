import { generateRandomToken } from "@/data-access/utils";

import { TOKEN_LENGTH, TOKEN_TTL } from "./resetAndVerifyLinks/lib";
import prisma from "@/db/prisma";
import { sendEmail } from "@/core-actions/emails/resend-core";
import { AppEmailTemplate } from "@/emails/magic-links";
import { applicationName } from "@/app-config";
import { upsertMagicLinkDA } from "./magic-links";
export async function createVerifyEmailTokenDA(userId: string) {
    const token = await generateRandomToken(TOKEN_LENGTH);
    const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

    await prisma.verifyEmailTokens.upsert({
        where: {
            userId
        },
        update: {
            token,
            tokenExpiresAt
        },
        create: {
            userId,
            token,
            tokenExpiresAt
        }
    })
    return token;
}
