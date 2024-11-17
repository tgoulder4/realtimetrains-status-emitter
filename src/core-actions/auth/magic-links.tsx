import { applicationName } from "@/app-config";
import {
    getMagicLinkDA,
    deleteMagicLinkDA,
    upsertMagicLinkDA,
} from "@/data-access/magic-links";
import {
    createFirstTimeUserDA,
    getUserByEmailDA,
    setEmailVerifiedDA,
} from "@/data-access/users";

import { NotFoundError, TokenExpiredError } from "@/lib/errors";
import { sendEmail } from "../emails/resend-core";
import { AppEmailTemplate } from "@/emails/magic-links";
import { createVerifyEmailTokenDA } from "@/data-access/verify-email";
import { env } from "@/env";

export async function sendMagicLinkCA(email: string) {
    const token = await upsertMagicLinkDA(email);

    await sendEmail(
        email,
        `Your magic login link for ${applicationName}`,
        AppEmailTemplate({
            title: `Your magic login link for ${applicationName}`,
            bodyText: `The code for your magic login link is: ${env.APP_URL}/login/magic/${token}`,
        })
    );
}

export async function LoginWithMagicLinkCA(token: string) {
    const magicLinkInfo = await getMagicLinkDA(token);
    if (!magicLinkInfo) {
        throw new NotFoundError();
    }

    if (magicLinkInfo.tokenExpiresAt! < new Date()) {
        throw new TokenExpiredError();
    }

    const existingUser = await getUserByEmailDA(magicLinkInfo.email);

    if (existingUser) {
        await setEmailVerifiedDA(existingUser.id);
        await deleteMagicLinkDA(token);
        return existingUser;
    } else {
        const newUser = await createFirstTimeUserDA(magicLinkInfo.email, existingUser || "");
        await deleteMagicLinkDA(token);
        // await createProfile(newUser.id, generateRandomName());
        return newUser;
    }
}
