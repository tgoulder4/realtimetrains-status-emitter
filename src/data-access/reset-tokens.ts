'use server'
import { UserId } from '@/lib/types';
import { generateRandomToken } from "@/data-access/utils"

import prisma from "@/db/prisma";
import { TOKEN_LENGTH, TOKEN_TTL } from './resetAndVerifyLinks/lib';

export async function createPasswordResetToken(userId: UserId) {
    const token = await generateRandomToken(TOKEN_LENGTH);
    const tokenExpiresAt = new Date(Date.now() + TOKEN_TTL);

    await prisma.resetTokens.deleteMany({
        where: {
            userId,
        },
    });
    await prisma.resetTokens.create({
        data: {
            userId,
            token,
            tokenExpiresAt,
        },
    });

    return token;
}

export async function getResetPasswordToken(token: string) {
    const existingToken = await prisma.resetTokens.findFirst({
        where: {
            token,
        },
    });
    return existingToken;
}

export async function deletePasswordResetToken(token: string, trx = prisma) {
    await trx.resetTokens.deleteMany({
        where: {
            token,
        },
    });
}
