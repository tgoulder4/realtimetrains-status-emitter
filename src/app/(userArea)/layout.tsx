import React from 'react'
import { validateRequest } from "@/lib/auth";
import { redirect } from 'next/navigation';
type Props = {}

async function UserAreaLayout({ }: Props) {
    const user = await validateRequest();
    if (!user) redirect('/login')
    return (
        <div>UserAreaLayout</div>
    )
}

export default UserAreaLayout