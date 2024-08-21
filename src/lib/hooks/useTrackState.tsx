'use client'
import { useEffect, useRef, useState } from 'react';
import { randomBytes } from 'crypto';
import { getTrackStateSA } from '@/app/track/actions';
import { TrackState, Journey } from '@/lib/types';
import { getTimeInMsUntilStartPolling } from '@/utils/timeUtils';
import { MIN_TIME_TIL_REFRESH } from '../constants';

export function useTrackingState(serviceToTrack: Journey) {
    console.log("serviceToTrack: ", serviceToTrack)
    const [currentTrackingState, setCurrentTrackingState] = useState<TrackState>({
        data: {
            status: "Loading",
            platform: {
                number: "--",
            },
            destination: { name: "--", code: "--" },
            provider: "--",
            scheduledDepartureTime: "--",
        },
        hidden: {
            timeTilRefresh: MIN_TIME_TIL_REFRESH,
            updateKey: randomBytes(16).toString('hex')
        }
    });
    const [timeRemaining, setTimeRemaining] = useState<number>(currentTrackingState.hidden.timeTilRefresh);
    const initialMainRanRef = useRef(false);
    useEffect(() => {
        console.log("status: ", currentTrackingState.data.status)
        let timer: NodeJS.Timeout;
        let clientCountdownTimer: NodeJS.Timeout;
        main();

        async function main() {
            console.log("running main, currentTimeTilRefresh: ", currentTrackingState.hidden.timeTilRefresh)
            timer = setInterval(async () => {
                console.log("main called")
                if (currentTrackingState.hidden.timeTilRefresh < MIN_TIME_TIL_REFRESH && currentTrackingState.data.status !== "Loading") return;
                console.log("timeTilRefresh: ", currentTrackingState.hidden.timeTilRefresh)
                if (currentTrackingState.data.status == "Go") {
                    console.log("clearing interval")
                    clearInterval(timer)
                };
                console.log("Getting new state")
                const newState = await getTrackStateSA({ journey: serviceToTrack });
                console.log("newState: ", newState)
                if (!newState || !newState[0]) {
                    console.error("ERROR FETCHING NEW_TRACK_STATE: ", newState[1].message);
                    clearInterval(timer);
                    return;
                }
                console.log("setting new state as currentTrackingState")
                setCurrentTrackingState(newState[0]);
                clientCountdownTimer = setInterval(() => {
                    setTimeRemaining(prev => prev - 1000);
                }, 1000);
                currentTrackingState.data.status == "Loading" && clearInterval(clientCountdownTimer);
            }, initialMainRanRef.current ? currentTrackingState.hidden.timeTilRefresh : Number(Infinity));
        }

        return () => { clearInterval(timer); clearInterval(clientCountdownTimer) };
    }, [currentTrackingState.data.status]);

    console.log("timeRemaining: ", timeRemaining)

    return [currentTrackingState, timeRemaining];
}