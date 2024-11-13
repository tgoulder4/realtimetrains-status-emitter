'use server'
import React from 'react'
import { OTPInput, SlotProps } from 'input-otp'
import { cn } from '@/lib/utils'
import { useServerAction } from 'zsa-react'
import { useToast } from '@/hooks/use-toast'
import { sendMagicLinkCA } from '@/core-actions/magic-links'
import { getUserById } from '@/data-access/users'
import { redirect } from 'next/navigation'
type Props = {
    searchParams: {
        userId: string
    }
}

async function VerifyEmailPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
    //check if the user exists, if so then if their email isn't verified send a magic link
    const { userId } = searchParams;
    if (!userId) {
        console.error("No uID in URL");
        redirect('/404?err=No%20uID%20in%20URL');
    }
    const user = await getUserById(userId as string);
    if (!user) {
        console.error("No user");
        redirect('/404?err=No%20user');
    }
    const { email, emailVerified } = user;
    if (emailVerified) {
        console.error("Email already verified");
        redirect('/find');
    }
    await sendMagicLinkCA(email);
    return (
        <div>
            <h1 className='text-center text-2xl'>We've sent you a link! Please use it to verify your email. </h1>
            {/* alternative: use OTP component */}
        </div>
    )
}


// Feel free to copy. Uses @shadcn/ui tailwind colors.
function Slot(props: SlotProps) {
    return (
        <div
            className={cn(
                'relative w-10 h-14 text-[2rem]',
                'flex items-center justify-center',
                'transition-all duration-300',
                'border-border border-y border-r first:border-l first:rounded-l-md last:rounded-r-md',
                'group-hover:border-accent-foreground/20 group-focus-within:border-accent-foreground/20',
                'outline outline-0 outline-accent-foreground/20',
                { 'outline-4 outline-accent-foreground': props.isActive },
            )}
        >
            {props.char !== null && <div>{props.char}</div>}
            {props.hasFakeCaret && <FakeCaret />}
        </div>
    )
}

// You can emulate a fake textbox caret!
function FakeCaret() {
    return (
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center animate-caret-blink">
            <div className="w-px h-8 bg-white" />
        </div>
    )
}

// Inspired by Stripe's MFA input.
function FakeDash() {
    return (
        <div className="flex w-10 justify-center items-center">
            <div className="w-3 h-1 rounded-full bg-border" />
        </div>
    )
}

export default VerifyEmailPage