'use client'
import React, { useEffect, useRef, useState } from 'react'
import WebSocket from 'ws';
import { env } from '@/env';
import { Journey, Service, TrackState } from '@/lib/types';
import { maxWidthClassNames } from '@/lib/layout';
import DepartureCard from '../DepartureCard';
import { getColourFromStatus, getDescriptionFromStatus, getGlyphFromStatus, getHexColourFromStatus, getIntuitiveStatusFromStatus } from './get-attributes-from-status';
import { useTrackingState } from '@/lib/hooks/useTrackState';
import { changeColour } from '@/lib/colours';
import PlatformCard from './platform-card';
type Props = {
    serviceToTrack: Journey;
}
function TrackingArea({ serviceToTrack }: Props) {
    const currentTrackingState = useTrackingState(serviceToTrack) as TrackState;
    //url like http://localhost:3000/track?trains=1940BHM+1200MAN
    const {
        destination,
        scheduledDepartureTime,
        provider,
        status,
        platform,
    } = currentTrackingState.data;
    console.log("scheduledDepartureTime: ", scheduledDepartureTime);
    const { timeTilRefresh, updateKey } = currentTrackingState.hidden;
    useEffect(() => {
        console.log("rendering tracking area with status: ", status);
    }, [])
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

                <PlatformCard updateKey={updateKey} platform={platform} status={status} timeTilRefresh={timeTilRefresh} />
                <div className="w-full flex flex-col  md:flex-row gap-3">
                    <div className="bg-black/5 w-full grid place-items-center py-5">
                        <div className="w-1/2 max-w-xl items-center flex flex-col gap-2">
                            <div className="h-2 mb-4">
                                {getGlyphFromStatus(status, Number(scheduledDepartureTime.slice(0, 2)), Number(scheduledDepartureTime.slice(2)))}
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