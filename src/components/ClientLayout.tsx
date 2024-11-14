'use client'

import React, { useState, useEffect } from 'react'
import { SplashScreen } from './SplashScreen'

type Props = { children: React.ReactNode }

export function ClientLayout({ children }: Props) {
    const [showSplash, setShowSplash] = useState(true)
console.log('showSplash', showSplash)
    useEffect(() => {
        const hasSeenSplash = localStorage.getItem('hasSeenSplash')
        console.log('hasSeenSplash', hasSeenSplash) 
        if (!hasSeenSplash){
            localStorage.setItem('hasSeenSplash', 'true')
            setShowSplash(false)
        }
    }, [])
useEffect(() => {
    console.log('showSplash set to', showSplash)
}, [showSplash])


    return (
        <>
            {showSplash && <SplashScreen />}
            {/* <SplashScreen/> */}
            {children}
        </>
    )
}