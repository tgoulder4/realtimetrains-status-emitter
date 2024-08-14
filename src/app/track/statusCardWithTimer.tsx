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
    const [dateToRender, setDateToRender] = useState<string>();
    const intervalRef = useRef<NodeJS.Timeout>();
    useEffect(() => {
        console.log("startTime or updateKey changed")
        timeRemainingRef.current = startTime;
        if (timeRemainingRef.current >= 15000) {
            //timerREmaining is in milliseconds from the time rn. convert it to HH:MM
            var d = new Date();
            d.setMilliseconds(timeRemainingRef.current);
            //get hours
            var _hours = d.getHours();
            //get minutes
            var _minutes = d.getMinutes();
            //pad them with 0s
            const hours = _hours < 10 ? '0' + _hours : _hours;
            const minutes = _minutes < 10 ? '0' + _minutes : _minutes;
            setDateToRender(hours + ":" + minutes);
        }
        intervalRef.current = setInterval(() => {
            console.log("startTime: ", startTime)
            console.log("updateKey: ", updateKey)
            console.log("timeRemaining: ", timeRemainingRef.current)
            timeRemainingRef.current = timeRemainingRef.current - 1000;
            timeRemainingRef.current < 15000 && setTimeToRender(timeRemainingRef.current)
        }, 1000);
        return () => clearInterval(intervalRef.current)
    }, [startTime, updateKey]);
    return (<>
        {
            platform.number == "--" ? <div className="bg-zinc-300 animate animate-pulse duration-500 w-full h-52 lg:h-72" />
                :
                <div className={` relative w-full overflow-hidden statusCard text-white flex flex-col items-center animate transition-colors ${getColourFromStatus(status)}`}>
                    <div className="absolute z-10 transition-all duration-700 h-full" style={{
                        width: `${((timeToRender / startTime) * 120)}%`,
                        backgroundColor: timeToRender <= -1 ? "#991b1b" : (timeToRender == startTime && startTime > 0) ? 'green' : `${changeColour(getHexColourFromStatus(status)).lighten(1).setAlpha((timeToRender / startTime) + 0.1)}`
                    }}></div>
                    <div className={`flex z-20 pt-5 flex-col items-center mt-3 `}>
                        <h2 className='font-semibold -mb-10'>Platform</h2>

                        <h1 className='text-[11.25rem]'>{platform.number}</h1>
                    </div>
                    <div className="-mt-12 -mb-3 z-20">
                        {status !== "Go" && status !== "Error" && <p className='text-black/20  font-bold' style={{ opacity: 1 }}>Checking again {((startTime <= 21000)) ? `in ${timeToRender / 1000}s` :
                            //given time to render is in seconds, add it to the current time and show it in HH:MM
                            `at ${dateToRender}`}</p>}
                    </div>
                    <div className="p-5 w-full z-20 ">
                        <div className="py-3 grid place-items-center bg-white/10 w-full" style={{ opacity: timeToRender <= 1 ? 20 : 1 }}>{getIntuitiveStatusFromStatus(status)} {platform.type == "confirmedAndChanged" && "- The platform has changed"}</div>
                    </div>
                </div>
        }
    </>)
}

export default StatusCardWithTimer