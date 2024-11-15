import React from 'react'
import { validateRequest } from "@/lib/auth";
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/Navbar';

// Define the Props interface for the component
interface Props { 
    children: React.ReactNode // Children prop to render nested components
}

// Export the default async function component
export default async function UserAreaLayout({ children }: Props) {
        // Validate the user request
        const user = await validateRequest();

        // Redirect to login if no user is found
        if (!user.user) {
            console.log("no user");
            redirect('/login')
        }

        // Redirect to email verification if the user's email is not verified
        if (!user.user.emailVerified) {
            console.log("email not verified");
            redirect('/sign-up/verifyEmail?userId=' + user.user.id)
        }

        // Placeholder for maintenance mode redirection
        if (false) redirect('/under-maintenance')

        // Render the layout with DialogProvider and ClientLayout
        return (
                    <main className="flex h-full flex-col">
                        <div className="min-h-screen bg-[#111111] text-white flex flex-col">
                            <Navbar />
                            {children} 
                        </div>
                    </main>
        )
    
}