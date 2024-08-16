'use client'
import React, { useEffect, useRef, useState } from 'react'
import WebSocket from 'ws';
import { env } from '@/env';
import { Journey, Service, TrackState } from '@/lib/types';
import { maxWidthClassNames } from '@/lib/layout';
import DepartureCard from '../DepartureCard';
import { getColourFromStatus, getDescriptionFromStatus, getGlyphFromStatus, getIntuitiveStatusFromStatus } from './getRenderInfoFromState';
import { TrackStateSchema } from '@/lib/schemas';
import { useServerAction } from "zsa-react";
import { getTrackStateSA } from './actions';
import { randomBytes } from 'crypto';
import StatusCardWithTimer from './statusCardWithTimer';
import { howManyMinutesPriorToDepartureToStartPolling } from '@/lib/constants';
type Props = {
    serviceToTrack: Journey;
}
function MainTrackingArea({ serviceToTrack }: Props) {

    //TOFIX: REPEATED CODE
    function getTimeInMsUntilStartPolling(depHours: number, depMins: number) {
        const depHoursInMs = depHours * 60 * 60 * 1000;
        console.log("depHours: ", depHours);
        const depMinsInMs = depMins * 60 * 1000;
        console.log("depMins: ", depMins);
        //get time now, with hours and minutes in milliseconds
        const now = new Date();
        const nowHours = now.getHours();
        console.log("nowHours: ", nowHours);
        const nowMins = now.getMinutes();
        console.log("nowMins: ", nowMins);

        //subtract the current time from the departure time
        const millisecondsUntilStartPolling = (depHoursInMs + depMinsInMs) - ((nowHours * 60 * 60 * 1000) + (nowMins * 60 * 1000) + (howManyMinutesPriorToDepartureToStartPolling * 60 * 1000));
        console.log("diff: ", millisecondsUntilStartPolling);
        return millisecondsUntilStartPolling;
    }
    const [currentTrackingState, setCurrentTrackingState] = useState<TrackState>({
        data: {
            status: "Prepare",
            platform: {
                number: "--",
                type: "confirmedAndChanged"
            },
            destination: { name: "--", code: "--" },
            provider: "--",
            scheduledDepartureTime: "--",
        },
        hidden: {
            timeTillRefresh: 0,
            updateKey: randomBytes(16).toString('hex')
        }
    });
    useEffect(() => {
        let timer: NodeJS.Timeout;
        main();
        if (currentTrackingState.hidden.timeTillRefresh < 10000) return; //safe guard: do not remove
        timer = setInterval(async () => { await main() }, currentTrackingState.hidden.timeTillRefresh);
        async function main() {
            // console.log("main called with timeTillRefresh: ", currentTrackingState.hidden.timeTillRefresh)
            if (currentTrackingState.data.status == "Go") clearInterval(timer);
            const newState = await getTrackStateSA({ journey: serviceToTrack });
            if (!newState || !newState[0]) {
                console.error("ERROR FETCHING NEW_TRACK_STATE: ", newState);
                return
            };
            console.log("newState: ", newState);
            if (newState[0].data.status == "Prepare") {
                const millisecondsUntilStartPolling = getTimeInMsUntilStartPolling(parseInt(serviceToTrack.departure.time.slice(0, 2)), parseInt(serviceToTrack.departure.time.slice(2)));
                console.log("millisecondsUntilStartPolling: ", millisecondsUntilStartPolling)
                if (millisecondsUntilStartPolling <= 0) {
                    newState[0].data.status = "Wait"
                    newState[0].hidden.timeTillRefresh = 10000;
                } else {
                    newState[0].data.status = "Prepare"
                    newState[0].hidden.timeTillRefresh = millisecondsUntilStartPolling;
                }
            }
            setCurrentTrackingState(newState[0]);
        }
        return () => clearInterval(timer);
    }, [currentTrackingState.data.status])
    //url like http://localhost:3000/track?trains=1940BHM+1200MAN
    console.log("currentTrackingState: ", currentTrackingState)
    const {
        destination,
        scheduledDepartureTime,
        provider,
        status,
        platform
    } = currentTrackingState.data;
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
                <StatusCardWithTimer status={status} platform={platform} updateKey={currentTrackingState.hidden.updateKey} startTime={currentTrackingState.hidden.timeTillRefresh} />
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

export default MainTrackingArea