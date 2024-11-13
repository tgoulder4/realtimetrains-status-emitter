'use client'
import { FormControl, Form, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useServerAction } from 'zsa-react'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ButtonThatLoads } from '@/components/ui/loadingButton'
import { RegisterSA } from './actions'

type Props = {
    successToastTitle: string;
    successToastDescription: string;
}


function RegisterForm({
    successToastDescription,
    successToastTitle
}: Props) {
    const registerSchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
    });
    const { execute, isPending, error, reset, } = useServerAction(RegisterSA as any, {
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
    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onInvalid = (errors: any) => console.error(errors)
    function onSubmit(values: z.infer<typeof registerSchema>) {
        if (values.password !== values.confirmPassword) {
            toast({
                title: 'Passwords do not match',
                variant: "destructive",
            });
            setErrorState(new Error('Passwords do not match'));
            return;
        }
        execute(values);
    }
    const [errorState, setErrorState] = React.useState<Error | null>(null);
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-6">
                    <div className="flex flex-row gap-4">
                        <FormField
                            control={form.control}

                            name="name"
                            render={({ field }) => (
                                <FormItem className='flex-1'>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            className="w-full"
                                            placeholder="Enter your Name"
                                            type="string"

                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className='flex-3'>
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
                    </div>

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
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        className="w-full"
                                        placeholder="Confirm Password"
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
                    {errorState?.message && (
                        <p className="text-red-600">{errorState.message}</p>
                    )}

                    <ButtonThatLoads isLoading={isPending} className="w-full" type="submit">

                        {
                            isPending ? <></> : 'Sign in'
                        }
                    </ButtonThatLoads>
                </form>
            </Form>
            <div className="flex flex-col justify-center">
                <Button asChild variant="link" className='mb-4'>
                    <Link href="/sign-in/forgot-password">Forgot Password</Link>
                </Button>

                <Button asChild variant="link" className='mb-4 text-gray-500'>
                    <Link href="/sign-up">Don't have an account? Sign Up</Link>
                </Button>

            </div>
        </>
    )
}

export default RegisterForm