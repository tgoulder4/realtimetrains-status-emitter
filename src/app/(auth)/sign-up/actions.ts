'use server'
import { sendMagicLinkCA } from "@/core-actions/magic-links"
import { registerUserCA, signInCA } from "@/core-actions/users"
import { getAccountByUserId } from "@/data-access/accounts"
import { upsertMagicLinkDA } from "@/data-access/magic-links"
import { DataLayerResponse, } from "@/data-access/users"
import { rateLimitByIp, rateLimitByKey } from "@/lib/limiter"
import { unauthenticatedAction } from "@/lib/safe-action"
import { setSession } from "@/lib/session"
import { redirect } from "next/navigation"
import { z } from "zod"

export const RegisterSA = unauthenticatedAction
    .createServerAction()
    .input(z.object({
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8).optional(),
        name: z.string(),
    }))
    .handler(async (input) => {
        const {
            email, password, name
        } = input.input;
        //verify
        await rateLimitByIp({ key: 'login', limit: 5, window: 30000 });
        const user = await registerUserCA(email, name, password); //makes a new user
        await setSession(user.id);
        redirect(`/sign-up/verifyEmail?userId=${user.id}`)

    })
