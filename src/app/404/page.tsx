import React from 'react'
import HeaderLogoWithName from '../track/LogoWithName'

type Props = {}

function SomethingWentWrong({ }: Props) {
    return (
        <>
            <HeaderLogoWithName pageTitle='Error' />
            <div className="flex flex-col items-center justify-center mt-12">
                <h1 className="text-4xl font-bold">Something went wrong</h1>
                <p className="text-lg">Please try again later</p>
            </div>
        </>
    )
}

export default SomethingWentWrong