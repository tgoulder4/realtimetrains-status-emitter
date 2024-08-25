'use client'
import { useCallback, useEffect, useRef, useState } from 'react';
import { randomBytes } from 'crypto';
import { getTrackStateSA } from '@/app/track/actions';
import { TrackState, Journey } from '@/lib/types';
import { MIN_TIME_TIL_REFRESH } from '../constants';
import { useServerAction } from 'zsa-react';

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
            timeTilRefresh: MIN_TIME_TIL_REFRESH,
            updateKey: randomBytes(16).toString('hex')
        }
    });
    useEffect(() => {
        let timer: NodeJS.Timeout;
        const fetchData = async () => {

            console.log("fetching data for service: ", serviceToTrack);
            const newState = await execute({ journey: serviceToTrack });
            console.log("newState: ", newState)
            if (newState[0]) {
                console.log("setting track state to: ", newState[0]);
                setCurrentTrackingState(newState[0]);
                if (newState[0].data.status == "Error" || newState[0].data.status == "Go") {
                    console.log("returning due to edge cases. newState: ", newState[0]);
                    clearInterval(timer);
                    return;
                };
            } else {
                console.error("ERROR FETCHING NEW_TRACK_STATE: ", newState[1].message);
            }
        }
        fetchData();
        timer = setInterval(() => {
            fetchData();
            console.log("refreshing in ", currentTrackingState.hidden.timeTilRefresh);
        }, currentTrackingState.hidden.timeTilRefresh < MIN_TIME_TIL_REFRESH ? MIN_TIME_TIL_REFRESH : currentTrackingState.hidden.timeTilRefresh);


        return () => clearInterval(timer);
    }, []);

    return currentTrackingState;
}