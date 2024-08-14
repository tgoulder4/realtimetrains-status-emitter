import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { changeColour } from '@/lib/colours'
import { getColourFromStatus, getHexColourFromStatus } from './getRenderInfoFromState'
import { Service } from '@/lib/types'
type Props = {
    startTime: number,
    updateKey: string,
    status: Service['status']
}

function CheckingAgainTimer({ startTime, status, updateKey }: Props) {
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
        <div className="flex-[2] w-full h-auto refreshInTimer pb-0 bg-white/40">
            <div className="grid place-items-center h-full">
                <Loader2 size={32} className={`transtion-all animate duration-1000 ${timeToRender <= 1 ? "duration-700 text-black" : " text-black/20"} animate-spin`} />
            </div>
            <motion.div id="progressBar" className='-mt-3 h-3  transition-all duration-700' style={{
                width: `${(timeToRender / startTime) * 100}%`,
                backgroundColor: timeToRender <= 0 ? "red" : `${changeColour(getHexColourFromStatus(status)).setAlpha(timeToRender / startTime)}`
            }}>
                {timeToRender <= -1 ? "Connection lost" : ""}
            </motion.div>
        </div>
    )
}

export default CheckingAgainTimer