'use client'
import { Service } from '@/lib/types'
import React, { useEffect, useRef, useState } from 'react'
import { getColourFromStatus, getHexColourFromStatus, getIntuitiveStatusFromStatus } from './getRenderInfoFromState'
import { changeColour } from '@/lib/colours'

type Props = {
    startTime: number,
    updateKey: string,
    status: Service['status']
    platform: Service['platform']
}

function StatusCardWithTimer({
    startTime,
    updateKey,
    status,
    platform
}: Props) {
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
        <div className={` relative w-full statusCard text-white flex flex-col items-center animate transition-colors ${getColourFromStatus(status)}`}>
            <div className="absolute z-10  transition-all duration-700 h-full" style={{
                width: `${((timeToRender / startTime) * 100) + 10}%`,
                backgroundColor: timeToRender <= -1 ? "red" : timeToRender == startTime ? 'green' : `${changeColour(getHexColourFromStatus(status)).lighten(2).setAlpha((timeToRender / startTime) + 0.1)}`
            }}></div>
            <div className="flex z-50 pt-5 flex-col items-center mt-3">
                <h2 className='font-semibold -mb-10'>Platform</h2>
                <h1 className='text-[11.25rem]'>{platform.number}</h1>
            </div>
            <p className='text-black/50'>Checking again in {timeToRender / 1000}s</p>
            <div className="p-5 w-full z-50 ">

                <div className="py-3 grid place-items-center bg-white/10 w-full" style={{ opacity: timeToRender <= 1 ? 20 : 1 }}>{getIntuitiveStatusFromStatus(status)}</div>
            </div>
        </div>
    )
}

export default StatusCardWithTimer