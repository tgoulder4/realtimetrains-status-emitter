import prisma from "@/db/prisma";
import { TOKEN_LENGTH, TOKEN_TTL } from "./resetAndVerifyLinks/lib";
import { generateRandomToken } from "./utils";

export async function upsertMagicLinkDA(email: string) {
    const token = await generateRandomToken(TOKEN_LENGTH);
    const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

    const updatedMagicLink = await prisma.magicLinks.upsert({
        where: {
            email,
        },
        create: {
            email,
            token,
            tokenExpiresAt,
        },
        update: {
            token,
            tokenExpiresAt,
        }
    })
    return token;
}

export async function getMagicLinkDA(token: string) {
    const existingToken = await prisma.magicLinks.findFirst({
        where: {
            token
        }
    });
    return existingToken;
}

export async function deleteMagicLinkDA(token: string) {
    await prisma.magicLinks.deleteMany({
        where: {
            token
        }
    })
}
