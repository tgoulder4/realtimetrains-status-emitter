import { applicationName } from '@/app-config'
import HeaderLogoWithName from '@/app/track/LogoWithName'
import React from 'react'

type Props = {
    children: React.ReactNode
}

function AuthLayout({ children }: Props) {
    return (
        <>
            <HeaderLogoWithName pageTitle={`${applicationName}`} />
            <main className='px-[35%] pt-12 flex flex-col justify-center w-full'>{children}</main>
        </>
    )
}

export default AuthLayout