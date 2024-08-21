'use client'
import React, { useEffect, useRef, useState } from 'react'
import WebSocket from 'ws';
import { env } from '@/env';
import { Journey, Service, TrackState } from '@/lib/types';
import { maxWidthClassNames } from '@/lib/layout';
import DepartureCard from '../DepartureCard';
import { getColourFromStatus, getDescriptionFromStatus, getGlyphFromStatus, getHexColourFromStatus, getIntuitiveStatusFromStatus } from './getRenderInfoFromState';
import { useTrackingState } from '@/lib/hooks/useTrackState';
import { changeColour } from '@/lib/colours';
import { getCheckingAgainText } from '@/utils/textUtils';
type Props = {
    serviceToTrack: Journey;
}
function TrackingArea({ serviceToTrack }: Props) {
    const [currentTrackingState, timeRemaining] = useTrackingState(serviceToTrack) as [TrackState, number];
    //url like http://localhost:3000/track?trains=1940BHM+1200MAN
    const {
        destination,
        scheduledDepartureTime,
        provider,
        status,
        platform,
    } = currentTrackingState.data;
    const { timeTilRefresh } = currentTrackingState.hidden;
    return (
        <div className={`flex h-full w-full flex-col px-4 py-8 bg-slate-100 ${maxWidthClassNames}`}>
            <div className="flex flex-col items-center gap-3 transition-all">
                <div className="flex flex-row w-full gap-3">
                    <DepartureCard shouldntDisplace className='w-full flex-[5]' partialDepartureInfo={{
                        destination: { name: destination.name, code: destination.code },
                        scheduledDepartureTime: scheduledDepartureTime.slice(0, 2) + ":" + scheduledDepartureTime.slice(2),
                        provider
                    }} />
                </div>
                <div className="hidden bg-yellow-800 bg-red-800 bg-green-800 bg-slate-800"></div>

                {/* statusCard */}
                {
                    platform.number == "--" ?
                        <div className="bg-zinc-300 animate animate-pulse duration-500 w-full h-52 lg:h-72" />
                        :
                        <div className={` relative w-full overflow-hidden statusCard text-white flex flex-col items-center animate transition-colors ${getColourFromStatus(status)}`}>
                            <div className="absolute z-10 transition-all duration-700 h-full" style={{
                                width: `${((timeRemaining / timeTilRefresh) * 120)}%`,
                                backgroundColor: (timeRemaining <= -1 && status !== "Go") ? changeColour(getHexColourFromStatus(status)).darken(10).toHexString() : (timeRemaining == timeTilRefresh && timeTilRefresh >= 0) ? 'green' : `${changeColour(getHexColourFromStatus(status)).lighten(1).setAlpha((timeRemaining / timeTilRefresh) + 0.1)}`
                            }}></div>
                            <div className={`flex z-20 pt-5 flex-col items-center mt-3 `}>
                                <h2 className='font-semibold -mb-10'>Platform</h2>

                                <h1 className='text-[11.25rem]'>{platform.number}</h1>
                            </div>
                            <div className="-mt-12 -mb-3 z-20">
                                {status !== "Go" && status !== "Error" && <p className='text-white/50  font-bold' style={{ opacity: 1 }}>{getCheckingAgainText(status, timeRemaining, timeTilRefresh)}</p>}
                            </div>
                            <div className="p-5 w-full z-20 ">
                                <div className="py-3 grid place-items-center bg-white/10 w-full" style={{ opacity: timeRemaining <= 1 ? 20 : 1 }}>{getIntuitiveStatusFromStatus(status)}</div>
                            </div>
                        </div>
                }
                <div className="w-full flex flex-col  md:flex-row gap-3">
                    <div className="bg-black/5 w-full grid place-items-center py-5">
                        <div className="w-1/2 max-w-xl items-center flex flex-col gap-2">
                            <div className="h-2 mb-4">
                                {getGlyphFromStatus(status)}
                            </div>
                            <h3 className='w-full text-center'>{getDescriptionFromStatus(status)}</h3>
                        </div>
                    </div>
                </div>
                {process.env.NODE_ENV == "development" && currentTrackingState.hidden.error && <div className="bg-white text-red-800 p-5">{String(currentTrackingState.hidden.error)}</div>}
            </div>
        </div>
    )
}

export default TrackingArea