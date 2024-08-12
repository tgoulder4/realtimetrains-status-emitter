'use client'
import React, { useEffect, useState } from 'react'
import WebSocket from 'ws';
import { env } from '@/env';
import { Service, TrackState } from '@/lib/types';
import { maxWidthClassNames } from '@/lib/layout';
import DepartureCard from '../Cards';
import { getColourFromStatus, getDescriptionFromStatus, getGlyphFromStatus, getIntuitiveStatusFromStatus } from './getRenderInfoFromState';
import CheckingAgainTimer from './checkingAgainTimer';
import { TrackStateSchema } from '@/lib/schemas';
import { getTimeDestAimInfoFromUrl, TGetTimeDestAimInfoFromUrl, TParsedTrainInfo } from './parseServiceInfoFromUrl';
import { hc } from 'hono/client'
import { dissectOneTrainInfoFromUrl, dissectTrainInfoFromUrl } from './dissectServicesToTrack';
import { useServerAction } from "zsa-react";
import { getTrackStateSA } from './actions';
type Props = {
    serviceToTrack: string;
}

function MainTrackingArea({ serviceToTrack }: Props) {
    const {
        aimStation,
        departure: { depDestinationStationName, depDestinationStation }, scheduledDepartureTime
    } = dissectOneTrainInfoFromUrl(serviceToTrack);
    const [currentTrackingState, setCurrentTrackingState] = useState<TrackState>({
        data: {
            status: "Go",
            platform: "0",
        },
        hidden: {
            timeTillRefresh: 0,
        }
    });
    const {
        status, //Wait, Go, Changed, Error
        platform,
        platformHasChanged,
    } = currentTrackingState.data;
    const { execute, isPending } = useServerAction(getTrackStateSA);
    async function getTrackingState(journeyInCondensedURLformat: string, prevState: TrackState) {
        try {
            const res = (await execute({ journeyInCondensedURLformat, prevState }));
            const data = res[0];

            const parseResult = TrackStateSchema.safeParse(data);
            if (parseResult.success) {
                const TrackState = parseResult.data;
                return TrackState;
            } else {
                console.error("")
                throw new Error(parseResult.error.errors[0].message);
            }
        } catch (e) {
            return {
                data: {
                    status: "Error",
                    platform: "0",
                },
                hidden: {
                    timeTillRefresh: 0,
                    error: e
                }
            } as TrackState
        }
    }
    useEffect(() => {
        async function getTrackState() {
            const newState = await getTrackingState(serviceToTrack, currentTrackingState);
            setCurrentTrackingState(newState);
        }
        getTrackState();
    }, [])
    //url like http://localhost:3000/track?trains=1940BHM+1200MAN
    return (
        <div className={`flex h-full w-full flex-col py-8 bg-slate-100 ${maxWidthClassNames}`}>
            <div className="flex flex-col items-center gap-3 transition-all">
                <DepartureCard shouldntDisplace className='w-full' service={{
                    destination: { name: depDestinationStationName, code: depDestinationStation },
                    scheduledDepartureTime: scheduledDepartureTime,
                    platform: { number: "0", type: "expected" },
                    status: "On time",
                }} />
                <div className="hidden bg-yellow-800 bg-red-800 bg-green-800 bg-slate-800"></div>
                <div className={`p-5 w-full statusCard text-white flex flex-col items-center transition-colors ${getColourFromStatus(status)}`}>
                    <div className="flex flex-col items-center mt-3">
                        <h2 className='font-semibold -mb-10'>Platform</h2>
                        <h1 className='text-[11.25rem]'>{platform}</h1>
                    </div>
                    <div className="py-3 grid place-items-center bg-white/10 w-full">{getIntuitiveStatusFromStatus(status)}</div>
                </div>
                <div className="w-full flex flex-col  md:flex-row gap-3">
                    <div className="bg-black/5 w-full grid place-items-center py-5">
                        <div className="w-1/2 max-w-xl items-center flex flex-col gap-2">
                            {getGlyphFromStatus(status)}
                            <h3 className='w-full text-center'>{getDescriptionFromStatus(status)}</h3>
                        </div>
                    </div>
                    <CheckingAgainTimer startTime={currentTrackingState.hidden.timeTillRefresh} />
                </div>
                {currentTrackingState.hidden.error && <div className="bg-white text-red-800 p-5">{currentTrackingState.hidden.error}</div>}
            </div>
        </div>
    )
}

export default MainTrackingArea