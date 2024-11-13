import prisma from "@/db/prisma";
import crypto from "crypto";

const ITERATIONS = 10000;

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

export async function createAccount(userId: string, plainTextPassword?: string) {
    console.log("Creating account with password", plainTextPassword);
    const salt = crypto.randomBytes(128).toString("base64");
    if (plainTextPassword) {
        console.log("plainTextPassword was true, creating account with password");
        const hash = await hashPassword(plainTextPassword, salt);
        const account = await prisma.account.create({
            data: {
                userId: userId,
                salt,
                password: hash
            }
        })
        return account;
    }
    else {
        console.log("plainTextPassword was false, creating account without password");
        const account = await prisma.account.create({
            data: {
                userId: userId,
                salt,
            }
        })
        return account;
    }
}

export async function getAccountByUser(userId: string) {
    const account = await prisma.account.findFirst({
        where: {
            userId
        }
    })
    return account;
}

export async function updatePasswordDA(
    userId: string,
    password: string,
) {
    const salt = crypto.randomBytes(128).toString("base64");
    const hash = await hashPassword(password, salt);
    await prisma.account.update({
        where: {
            userId
        },
        data: {
            password: hash,
            salt
        }
    })
}

// export async function getAccountByGoogleId(googleId: string) {
//     return await prisma.account.findFirst({
//         where: {
//             googleId
//         }
//     })
// }

// export async function getAccountByGithubId(githubId: string) {
//     return await prisma.account.findFirst({
//         where: {
//             githubId
//         }
//     })
// }