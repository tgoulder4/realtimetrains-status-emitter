import React from 'react'
import { validateRequest } from "@/lib/auth";
import { redirect } from 'next/navigation';
type Props = { children: React.ReactNode }

async function UserAreaLayout({ children }: Props) {
    const user = await validateRequest();
    //check if under maintenance here
    if (!user.user) {
        console.log("no user");
        redirect('/login')
    };
    if (!user.user.emailVerified) {
        console.log("email not verified");
        redirect('/sign-up/verifyEmail?userId=' + user.user.id)
    };
    //if under maintenance redirect to maintenance page
    if (false) redirect('/under-maintenance')
    return (children)
}

export default UserAreaLayout