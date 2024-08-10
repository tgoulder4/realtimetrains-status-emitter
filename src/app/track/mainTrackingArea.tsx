'use client'
import React, { useState } from 'react'
import WebSocket from 'ws';
import { env } from '@/env';
import { TrackState } from '@/lib/types';
import { maxWidthClassNames } from '@/lib/layout';
import DepartureCard from '../Cards';
import { getColourFromStatus, getIntuitiveStatusFromStatus } from './getRenderInfoFromState';

type Props = {
    servicesToTrack: { destCode: string, depTime: string }[]
}

function MainTrackingArea({ servicesToTrack }: Props) {
    const [currentServiceState, setCurrentServiceState] = useState<TrackState>({
        data: {
            status: "Go",
            platform: "15",
        },
        hidden: {
            timeTillRefresh: 5
        }
    });
    const {
        status, //Wait, Go, Changed, Error
        platform,
        platformHasChanged,
        minutesUntilDeparture
    } = currentServiceState.data;
    //url like http://localhost:3000/track?trains=1940BHM+1200MAN
    return (
        <div className={`flex h-full w-full flex-col py-8 bg-slate-100 ${maxWidthClassNames}`}>
            <script src="/socket.io/socket.io.js"></script>
            <script>
                {/* const socket = io(); */}
            </script>
            <div className="flex flex-col gap-3">
                <DepartureCard shouldntDisplace service={{
                    destinationStationName: "Manchester Piccadilly",
                    departureTime: "12:00",
                    platform: "1",
                    status: "On time",
                    stationCode: ''
                }} />
                <div className="hidden bg-yellow-800 bg-red-800 bg-green-800 bg-slate-800"></div>
                <div className={`p-5 statusCard text-white flex flex-col items-center transition-colors ${getColourFromStatus(status)}`}>
                    <div className="flex flex-col items-center mt-3">
                        <h2 className='font-semibold -mb-10'>Platform</h2>
                        <h1 className='text-[11.25rem]'>{platform}</h1>
                    </div>
                    <div className="py-3 grid place-items-center bg-white/10 w-full">{getIntuitiveStatusFromStatus(status)}</div>
                </div>
            </div>
        </div>
    )
}

export default MainTrackingArea