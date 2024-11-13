
import prisma from "@/db/prisma";
import crypto from "crypto";

export async function generateRandomToken(length: number) {
    const buf = await new Promise<Buffer>((resolve, reject) => {
        crypto.randomBytes(Math.ceil(length / 2), (err, buf) => {
            if (err !== null) {
                reject(err);
            } else {
                resolve(buf);
            }
        });
    });

    return buf.toString("hex").slice(0, length);
}

export async function createTransaction<T extends typeof prisma>(
    cb: (trx: T) => void
) {
    //try returning this if it doesn't work
    await prisma.$transaction(cb as any);
}

export function convertStages(stages: string[]) {
    //go through each stage, replace '_' with ' ', 'and' with '&' and capitalize the first letter of each word
    return stages.map((stage) => {
        return stage
            .replace(/_/g, " ")
            .replace(/ and /g, " & ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
    });
}