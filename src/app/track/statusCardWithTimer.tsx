'use client'
import { Service } from '@/lib/types'
import React, { useEffect, useRef, useState } from 'react'
import { getColourFromStatus, getHexColourFromStatus, getIntuitiveStatusFromStatus } from './getRenderInfoFromState'
import { changeColour } from '@/lib/colours'
import { howManyMinutesPriorToDepartureToStartPolling } from '@/lib/constants'
import { toast } from 'sonner'


type Props = {
    startTime: number,
    updateKey: string,
    status: Service['status'],
    platform: Service['platform']
}
function getCheckingAgainText(status: Service['status'], timeToRender: number, timeRemaining: number, startTimeInMs: number) {
    console.log("timeToRender: ", timeToRender)
    console.log("timeRemaining: ", timeRemaining)
    console.log("startTimeInMs: ", startTimeInMs)
    console.log("howManyMsPriorToDepartureToStartPolling: ", (howManyMinutesPriorToDepartureToStartPolling * 60 * 1000))
    if (timeToRender <= -5000) {
        return 'Still checking...'
    }
    else if ((timeToRender < 0) && startTimeInMs > 0) {
        return 'Checking...'
    }
    else if (((startTimeInMs <= 10000))) {
        return `Checking again in ${timeToRender / 1000}s`
    }
    else if (startTimeInMs <= (howManyMinutesPriorToDepartureToStartPolling * 60 * 1000)) {
        //add the time remaining to the current time then show the time in HH:MM
        //timeremaining is in ms. convert to minutes and hours then add to current time
        const d = new Date();
        d.setMilliseconds(d.getMilliseconds() + timeRemaining);
        console.log("d.getHours(): ", d.getHours(), "d.getMinutes(): ", d.getMinutes())
        return `Checking again at ${d.getHours() < 10 ? '0' + d.getHours() : d.getHours()}:${d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()}`
    } else {
        return "Error"
    }

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
        //THIS USEEFFECT SHOULD BE MERGED WITH THE OTHER ONE.
        timeRemainingRef.current = startTime;
        intervalRef.current = setInterval(() => {
            //MESSY SOLUTION
            if (status == "Go") clearInterval(intervalRef.current);

            console.log("startTime: ", startTime)
            console.log("updateKey: ", updateKey)
            console.log("timeRemaining: ", timeRemainingRef.current)
            timeRemainingRef.current = timeRemainingRef.current - 1000;
            timeRemainingRef.current < 15000 && setTimeToRender(timeRemainingRef.current);
            if (timeRemainingRef.current == -5000) {
                toast.error("Something's off track.", { duration: 28000, })
            } else if (timeRemainingRef.current == -30000) {
                if (typeof window !== undefined) window.location.href = '/find?err=Something%20went%20wrong.%20Please%20try%20tracking%20again.'
            }
        }, 1000);
        return () => clearInterval(intervalRef.current)
    }, [startTime, updateKey]);
    return (<>
        {
            platform.number == "--" ?
                <div className="bg-zinc-300 animate animate-pulse duration-500 w-full h-52 lg:h-72" />
                :
                <div className={` relative w-full overflow-hidden statusCard text-white flex flex-col items-center animate transition-colors ${getColourFromStatus(status)}`}>
                    <div className="absolute z-10 transition-all duration-700 h-full" style={{
                        width: `${((timeToRender / startTime) * 120)}%`,
                        backgroundColor: (timeToRender <= -1 && status !== "Go") ? changeColour(getHexColourFromStatus(status)).darken(10).toHexString() : (timeToRender == startTime && startTime >= 0) ? 'green' : `${changeColour(getHexColourFromStatus(status)).lighten(1).setAlpha((timeToRender / startTime) + 0.1)}`
                    }}></div>
                    <div className={`flex z-20 pt-5 flex-col items-center mt-3 `}>
                        <h2 className='font-semibold -mb-10'>Platform</h2>

                        <h1 className='text-[11.25rem]'>{platform.number}</h1>
                    </div>
                    <div className="-mt-12 -mb-3 z-20">
                        {status !== "Go" && status !== "Error" && <p className='text-white/50  font-bold' style={{ opacity: 1 }}>{getCheckingAgainText(status, timeToRender, timeRemainingRef.current, startTime)}</p>}
                    </div>
                    <div className="p-5 w-full z-20 ">
                        <div className="py-3 grid place-items-center bg-white/10 w-full" style={{ opacity: timeToRender <= 1 ? 20 : 1 }}>{getIntuitiveStatusFromStatus(status)} {platform.type == "confirmedAndChanged" && "- The platform has changed"}</div>
                    </div>
                </div>
        }
    </>)
}

export default StatusCardWithTimer