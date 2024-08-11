import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
type Props = {
    startTime: number,
}

function CheckingAgainTimer({ startTime }: Props) {
    const [timeRemaining, setTimeRemaining] = useState(startTime)
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeRemaining(timeRemaining - 1)
        }, 1000)
        return () => clearInterval(interval)
    }, [timeRemaining])
    return (
        <div className="w-full refreshInTimer flex-1 pb-0 bg-white">
            <div className="grid px-12 place-items-center h-[calc(100%-12px)]">
                <Loader2 size={32} className={`transtion-all animate ${timeRemaining <= 0 ? "animate-reverse-spin text-black/90" : "animate-spin text-black/50"}`} />
            </div>
            <motion.div id="progressBar" className='h-3 bg-black transition-all duration-700' style={{ width: `calc(100% * ${timeRemaining} / ${startTime})` }}></motion.div>
        </div>
    )
}

export default CheckingAgainTimer