import { TrackStatusResponse } from '@/schemas/trackStatus';
import { useState, useEffect } from 'react';
import { useServerAction } from 'zsa-react';
import *  as  Realm from "realm-web";
import { getTrackStateSA } from '@/app/track/[...origin]/actions';

// interface Tracksta {
//     tId: string;
//     status: "Wait" | "Go" | "Prepare" | "Unknown";
//     platform: { number: string };
//     scheduledDepartureTime: string;
//     destination: { name: string; code: string };
//     callingAt: { name: string; code: string }[];
//     provider: string;
//     millisecondsTilRefresh: number;
//     Trainpeekcount: number;
// }

interface UseTrackStateProps {
    departureId: string;
    origin: string;
    userId: string;
}

const mockTrackingState: TrackStatusResponse = {
    tId: "1234",
    status: "Wait",
    platform: { number: "1" },
    scheduledDepartureTime: "10:30",
    destination: { name: "Birmingham New Street", code: "BHM" },
    callingAt: [
        { name: "Watford Junction", code: "WFJ" },
        { name: "Milton Keynes Central", code: "MKC" },
        { name: "Coventry", code: "COV" }
    ],
    provider: "Avanti West Coast",
    millisecondsTilRefresh: 9000,
    remainingCredits: 100,
    timeKeepingStatus: "OnTime"
};

// const REALM_APP_ID = 'your-realm-app-id'; // Replace with your actual Realm App ID

export function useTrackState({ departureId, origin, userId }: UseTrackStateProps) {
    const [trackingState, setTrackingState] = useState<TrackStatusResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                //use only for testing colours of platform card
                // if (false) {
                // Simulating API call with a delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Simulate status changes
                const statuses: ("Wait" | "Go" | "Prepare" | "Unknown")[] = ["Wait", "Prepare", "Go", "Unknown"];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

                setTrackingState({
                    ...mockTrackingState,
                    status: randomStatus,
                    millisecondsTilRefresh: 9000, // Reset the countdown each time
                });
                // }

                getTrackStateSA({
                    departureId,
                    origin,
                    userId
                }).then((response) => {
                    const [data, err] = response;
                    if (!err) {
                        setTrackingState(data as TrackStatusResponse);
                    } else {
                        throw new Error("Failed to fetch tracking state");
                    }
                }).catch(err => {
                    console.error("[useTrackState] Error fetching tracking state:", err);
                    setError(err instanceof Error ? err : new Error('An unknown error occurred'));
                });

            } catch (err) {
                setError(err instanceof Error ? err : new Error('An unknown error occurred'));
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 9000); // Fetch every 9 seconds

        return () => clearInterval(interval);
    }, [departureId, origin, userId]);

    return { trackingState, error };
}