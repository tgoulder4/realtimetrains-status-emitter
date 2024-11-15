'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Train } from 'lucide-react'

export function SplashScreen() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    if (!isVisible) return null

    return (
        <motion.div
            className="splashscreen fixed inset-0 z-50 flex items-center justify-center bg-[#111111]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <Train className="w-24 h-24 text-teal-500" />
            </motion.div>
            <div className="flex flex-col ml-4">
            <motion.h1
                className="text-4xl font-bold text-white "
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                Beat the Rush
            </motion.h1>
            <motion.p
                className="text-white  mt-2"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 0.6, y: 0 }}
                transition={{ delay: 0.7 }}
            >
                London Euston
            </motion.p>
            </div>
        </motion.div>
    )
}