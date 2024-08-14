import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
type Props = {
    startTime: number,
    updateKey: string
}

function CheckingAgainTimer({ startTime, updateKey }: Props) {
    const timeRemainingRef = useRef(startTime);
    const [timeToRender, setTimeToRender] = useState(timeRemainingRef.current);
    const intervalRef = useRef<NodeJS.Timeout>();
    useEffect(() => {
        timeRemainingRef.current = startTime;
        intervalRef.current = setInterval(() => {
            console.log("startTime: ", startTime)
            console.log("updateKey: ", updateKey)
            console.log("timeRemaining: ", timeRemainingRef.current)
            timeRemainingRef.current = timeRemainingRef.current - 1000;
            setTimeToRender(timeRemainingRef.current)
        }, 1000)
        return () => clearInterval(intervalRef.current)
    }, [startTime, updateKey]);
    return (
        <div className="w-36 refreshInTimer pb-0 bg-white">
            <div className="grid place-items-center h-[calc(100%-12px)]">
                <Loader2 size={32} className={`transtion-all animate ${timeToRender <= 1 ? "duration-700 text-black" : " text-black/20"} animate-spin`} />
            </div>
            <motion.div id="progressBar" className='h-3 bg-black transition-all duration-700' style={{
                width: `${(timeToRender / startTime) * 100}%`,
                backgroundColor: timeToRender <= 0 ? "red" : `rgba(0,0,0,${(timeToRender / startTime)})`
            }}>
                {timeToRender <= -1 ? "Connection lost" : ""}
            </motion.div>
        </div>
    )
}

export default CheckingAgainTimer