'use server'
import {
    createUser,
    deleteUser,
    getUserByEmailDA,
    updateUser,
    verifyPasswordDA,
} from "@/data-access/users";
import { UserId, UserSession } from "@/lib/types";
import {
    createAccount,
    updatePasswordDA,
} from "@/data-access/accounts";
// import { createProfile, getProfile } from "@/data-access/profiles";
// import { GoogleUser } from "@/app/api/login/google/callback/route";
// import { GitHubUser } from "@/app/api/login/github/callback/route";
import {
    createPasswordResetToken,
    deletePasswordResetToken,
    getResetPasswordToken,
} from "@/data-access/reset-tokens";
// import { ResetPasswordEmail } from "@/emails/reset-password";

import { applicationName } from "@/app-config";

// import { generateRandomName } from "@/lib/names";


import { createTransaction } from "@/data-access/utils";
import { AuthenticationError, EmailInUseError, LoginError } from "@/lib/errors";
import { getVerifyEmailToken, deleteVerifyEmailToken } from "@/data-access/verify-email";
import { sendEmail } from "./resend-core";
import { User } from "lucia";


export async function deleteUserCA(
    authenticatedUser: UserSession,
    userToDeleteId: UserId
): Promise<void> {
    if (authenticatedUser.id !== userToDeleteId) {
        throw new AuthenticationError();
    }

    await deleteUser(userToDeleteId);
}

// export async function getUserProfileCA(userId: UserId) {
//     const profile = await getProfile(userId);

//     if (!profile) {
//         throw new NotFoundError();
//     }

//     return profile;
// }

export async function registerUserCA(email: string, name: string, password?: string) {
    const existingUser = await getUserByEmailDA(email);
    if (existingUser) {
        throw new EmailInUseError();
    }

    const user = await createUser(email, name);
    await createAccount(user.id, password);
    // await createProfile(user.id, generateRandomName());
    return { id: user.id };
}

/**
 * When the send email notify-about-sentinel button is clicked on Sentinel admin page.
 * @param email 
 * @param name 
 * @returns 
 */

export async function signInCA(email: string, password: string) {
    const user = await getUserByEmailDA(email);

    if (!user) {
        throw new LoginError();
    }

    const isPasswordCorrect = await verifyPasswordDA(email, password);

    if (!isPasswordCorrect) {
        throw new LoginError();
    }

    return user;
}

// export async function createGithubUserCA(githubUser: GitHubUser) {
//     let existingUser = await getUserByEmailDA(githubUser.email);

//     if (!existingUser) {
//         existingUser = await createUser(githubUser.email);
//     }

//     await createAccountViaGithub(existingUser.id, githubUser.id);

//     await createProfile(existingUser.id, githubUser.login, githubUser.avatar_url);

//     return existingUser.id;
// }

// export async function createGoogleUserCA(googleUser: GoogleUser) {
//     let existingUser = await getUserByEmailDA(googleUser.email);

//     if (!existingUser) {
//         existingUser = await createUser(googleUser.email);
//     }

//     await createAccountViaGoogle(existingUser.id, googleUser.sub);

//     await createProfile(existingUser.id, googleUser.name, googleUser.picture);

//     return existingUser.id;
// }

export async function resetPasswordCA(email: string) {
    const user = await getUserByEmailDA(email);

    if (!user) {
        throw new AuthenticationError();
    }

    const token = await createPasswordResetToken(user.id);

    // await sendEmail(
    //     email,
    //     `Your password reset link for ${applicationName}`,
    //     <ResetPassword token={token} />
    // );
}

export async function changePasswordCA(token: string, password: string) {
    const tokenEntry = await getResetPasswordToken(token);

    if (!tokenEntry) {
        throw new AuthenticationError();
    }

    const userId = tokenEntry.userId;

    await createTransaction(async (trx) => {
        await deletePasswordResetToken(token, trx);
        await updatePasswordDA(userId, password);
    });
}

export async function confirmTokenCA(token: string) {
    const tokenEntry = await getVerifyEmailToken(token);

    if (!tokenEntry) {
        throw new AuthenticationError();
    }
    await deleteVerifyEmailToken(token);
    await updateUser(tokenEntry.userId, { emailVerified: true });

    return tokenEntry.userId;
}