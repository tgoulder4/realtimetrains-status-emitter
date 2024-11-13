'use server'
import crypto from "crypto";
import { getAccountByUserId } from "@/data-access/accounts";
import prisma from "@/db/prisma";
import { UserSchema } from '../../prisma/generated/zod';
import { z } from 'zod';
export type DataLayerResponse = {
    success: boolean,
    errors?: any
}
const ITERATIONS = 10000;
const MAGIC_LINK_TOKEN_TTL = 1000 * 60 * 5; // 5 min

export async function deleteUser(userId: string) {
    await prisma.user.delete({
        where: {
            id: userId,
        },
    });

}

export async function getUserById(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    return user;
}
async function hashPassword(plainTextPassword: string, salt: string) {
    return new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(
            plainTextPassword,
            salt,
            ITERATIONS,
            64,
            "sha512",
            (err, derivedKey) => {
                if (err) reject(err);
                resolve(derivedKey.toString("hex"));
            }
        );
    });
}

export async function createUser(email: string, name: string) {
    const user = await prisma.user.create({
        data: {
            email,
            name
        }
    })
    return user;
}

export async function createFirstTimeUserDA(email: string, name: string) {
    const user = await prisma.$transaction(async (tx) => {
        const u = await tx.user.create({
            data: {
                email,

                name
            }
        });
        await tx.account.create({
            data: {
                userId: u.id,
            }
        })
        return u;
    });
    return user;
}
export async function verifyPasswordDA(email: string, plainTextPassword: string) {
    const user = await getUserByEmailDA(email);

    if (!user) {
        return false;
    }

    const account = await getAccountByUserId(user.id);

    if (!account) {
        return false;
    }

    const salt = account.salt;
    const savedPassword = account.password;

    if (!salt || !savedPassword) {
        return false;
    }

    const hash = await hashPassword(plainTextPassword, salt);
    return account.password == hash;
}
export async function getUserByEmailDA(email: string) {
    const user = await prisma.user.findFirst({
        where: {
            email,
        },
    });
    return user;
}



export async function setEmailVerifiedDA(userId: string) {
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            emailVerified: true,
        },
    });
}
export async function updateUser(userId: string, updatedUser: Partial<z.infer<typeof UserSchema>>) {
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: updatedUser,
    });
}
