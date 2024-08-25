import { changeColour } from '@/lib/colours';
import React, { useEffect, useState } from 'react'
import { getColourFromStatus, getHexColourFromStatus, getIntuitiveStatusFromStatus } from './get-attributes-from-status';
import { getCheckingAgainText } from '@/utils/textUtils';
import { Service } from '@/lib/types';

type Props = {
    platform: {
        number: string;
    },
    status: Service['status'],
    timeTilRefresh: number,
    updateKey: string
}

function PlatformCard({
    platform,
    status,
    timeTilRefresh,
    updateKey
}: Props) {
    const [checkingAgainIn, setCheckingAgainIn] = useState<number>(timeTilRefresh);
    useEffect(() => {
        console.log("updatekey changed in platform card: ", updateKey)
        setCheckingAgainIn(timeTilRefresh);
        const interval = setInterval(() => {
            setCheckingAgainIn(prev => prev - 1000);
        }, 1000);
        return () => clearInterval(interval);
    }, [updateKey]);
    return (
        <>
            {
                platform.number == "--" ?
                    <div className="bg-zinc-300 animate animate-pulse duration-500 w-full h-52 lg:h-72" />
                    :
                    <div className={` relative w-full overflow-hidden statusCard text-white flex flex-col items-center animate transition-colors ${getColourFromStatus(status)}`}>
                        <div className="absolute z-10 transition-all duration-700 h-full" style={{
                            width: `${((checkingAgainIn / timeTilRefresh) * 120)}%`,
                            backgroundColor:
                                changeColour(getHexColourFromStatus(status)).lighten(1).setAlpha((checkingAgainIn / timeTilRefresh) + 1.5).toString()
                            // (checkingAgainIn <= -1 && status !== "Go")
                            //     ?
                            //     changeColour(getHexColourFromStatus(status)).darken(10).toHexString()
                            //     : (checkingAgainIn == timeTilRefresh && timeTilRefresh >= 0)
                            //         ?
                            //         'green'
                            //         :
                            //         `${changeColour(getHexColourFromStatus(status)).lighten(1).setAlpha((checkingAgainIn / timeTilRefresh) + 0.1)}`
                        }}></div>
                        <div className={`flex z-20 pt-5 flex-col items-center mt-3 `}>
                            <h2 className='font-semibold -mb-10'>Platform</h2>

                            <h1 className='text-[11.25rem]'>{platform.number}</h1>
                        </div>
                        <div className="-mt-12 -mb-3 z-20">
                            {status !== "Go" && status !== "Error" && <p className='text-white/50  font-bold' style={{ opacity: 1 }}>{getCheckingAgainText(status, checkingAgainIn, timeTilRefresh)}</p>}
                        </div>
                        <div className="p-5 w-full z-20 ">
                            <div className="py-3 grid place-items-center bg-white/10 w-full" style={{ opacity: checkingAgainIn <= 1 ? 20 : 1 }}>{getIntuitiveStatusFromStatus(status)}</div>
                        </div>
                    </div>
            }</>
    )
}

export default PlatformCard