'use client'
import { useCallback, useEffect, useRef, useState } from 'react';
import { randomBytes } from 'crypto';
import { getTrackStateSA } from '@/app/track/actions';
import { TrackState, Journey } from '@/lib/types';
import { MIN_TIME_TIL_REFRESH } from '../constants';
import { useServerAction } from 'zsa-react';
import { getTimeInMsUntilStartPolling } from '@/core-actions/core/utils/time-handling';

export function useTrackingState(serviceToTrack: Journey) {
    const { execute } = useServerAction(getTrackStateSA);
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
            timeTilRefresh: MIN_TIME_TIL_REFRESH * 20,
            timeWhenPollingStarts: "--",
            updateKey: randomBytes(16).toString('hex')
        }
    });
    useEffect(() => {
        let timer: NodeJS.Timeout;
        const fetchData = async () => {
            console.log("Fetchdata called. It'll next be called in ", currentTrackingState.hidden.timeTilRefresh);
            //run getTrackStateSA with journey serviceToTrack
            const res = await execute({ journey: serviceToTrack });
            console.log("res: ", res)

            //if res[0] is not null, set newTrackState to res[0]
            if (res[0]) {
                let newTrackState: TrackState = res[0];
                //if newTrackState.status is prepare, calculate time until polling starts
                if (newTrackState.data.status == "Prepare") {
                    const timeUntilStartPolling = getTimeInMsUntilStartPolling(Number(serviceToTrack.departure.time.slice(0, 2)), Number(serviceToTrack.departure.time.slice(2)));
                    console.log("timeuntilstartpolling: ", timeUntilStartPolling);
                    //if timeUntilStartPolling is less than 0, set status to Wait
                    if (timeUntilStartPolling <= 0) {
                        console.log("timeUntilStartPolling: ", timeUntilStartPolling, " was less than 0. Setting status to Wait.");
                        newTrackState.data.status = "Wait"
                    } else {
                        newTrackState.hidden.timeTilRefresh = timeUntilStartPolling;
                    }
                }
                console.log("setting newTrackState: ", newTrackState);
                //set currentTrackingState to newTrackState
                setCurrentTrackingState(newTrackState);
                if (newTrackState.data.status == "Error" || newTrackState.data.status == "Go") {
                    console.log("returning due to edge cases. newState: ", newTrackState);
                    clearInterval(timer);
                    return;
                };
            } else {
                console.error("ERROR FETCHING NEW_TRACK_STATE: ", res[1].message);
            }
        }
        fetchData();
        timer = setInterval(() => {
            fetchData();
            console.log("refreshing in ", currentTrackingState.hidden.timeTilRefresh);
        }, currentTrackingState.hidden.timeTilRefresh < MIN_TIME_TIL_REFRESH ? MIN_TIME_TIL_REFRESH : currentTrackingState.hidden.timeTilRefresh);


        return () => clearInterval(timer);
    }, [
        currentTrackingState.data.status
    ]);

    return currentTrackingState;
}