import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Data Access Layer functions
export async function getCreditsDA(userId: string): Promise<number | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true }
    })

    return user?.credits ?? null
}

export async function decrementCreditsDA(userId: string): Promise<number | null> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { credits: true }
    })

    if (!user || user.credits < 1) {
        return null
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
        select: { credits: true }
    })

    return updatedUser.credits
}
export async function addCreditsDA(userId: string, amount: number): Promise<number | null> {
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            credits: {
                increment: amount
            }
        },
        select: { credits: true }
    })

    return updatedUser.credits
}