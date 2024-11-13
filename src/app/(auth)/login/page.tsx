'use client'
import { FormControl, Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import React, { useEffect } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LoginSA } from '../login/actions'
import { Loader2 } from 'lucide-react'
import { ButtonThatLoads } from '@/components/ui/loadingButton'
import HeaderLogoWithName from '@/app/track/LogoWithName'
import { applicationName } from '@/app-config'

type Props = {
    successToastTitle: string;
    successToastDescription: string;
}


function LoginForm({
    successToastDescription,
    successToastTitle
}: Props) {
    const loginSchema = z.object({
        email: z.string().email(),
        password: z.string().min(8),
    });
    const { execute, isPending, error, reset, } = useServerAction(LoginSA as any, {
        onError({ err }) {
            console.log("error", err)
            toast({
                title: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: successToastTitle,
                description: successToastDescription,
            });
        },
    });
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onInvalid = (errors: any) => console.error(errors)
    function onSubmit(values: z.infer<typeof loginSchema>) {
        execute(values);

    }
    const [errorState, setErrorState] = React.useState<string | null>(null);
    useEffect(() => {
        if (error) {
            //open dialog
        }
    }, [error])
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="w-full"
                                        placeholder="Enter your email"
                                        type="email"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="w-full"
                                        placeholder="Enter your password"
                                        type="password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {error && (
                        <p className="text-red-600">{error.message}</p>
                    )}

                    <ButtonThatLoads isLoading={isPending} className="w-full" type="submit">

                        {
                            isPending ? <></> : 'Sign in'
                        }
                    </ButtonThatLoads>
                </form>
            </Form>
            <div className="flex flex-col justify-center">
                <Button asChild variant="link" className='mb-4 mt-2 text-gray-500'>
                    <Link href="/sign-in/forgot-password">Forgot Password?</Link>
                </Button>
                <hr className='opacity-20 mb-4 mt-2' />
                <Button asChild variant="link" className='mb-4 '>
                    <Link href="/sign-up">Don't have an account? Sign Up</Link>
                </Button>

            </div>
        </>
    )
}

export default LoginForm