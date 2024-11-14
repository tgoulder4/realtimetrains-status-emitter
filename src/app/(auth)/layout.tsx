import { applicationName } from '@/app-config'

import React from 'react'

type Props = {
    children: React.ReactNode
}

function AuthLayout({ children }: Props) {
    return (
        <>

            <main className='px-[35%] pt-12 flex flex-col justify-center w-full'>{children}</main>
        </>
    )
}

export default AuthLayout