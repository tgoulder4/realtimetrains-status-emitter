'use server'
import React, { useState } from 'react'
import WebSocket from 'ws';
import { env } from '@/env';
import { TrackState } from '@/lib/types';
import { maxWidthClassNames } from '@/lib/layout';
import MainTrackingArea from './mainTrackingArea';
import { redirect } from 'next/navigation';

type Props = {
    searchParams: { [key: string]: string | string[] | undefined }
}

async function TrackPage({ searchParams }: Props) {
    const trains = searchParams.trains as string;
    console.log("trains found in url: ", trains)
    if (!trains) {
        console.error("No trains to track")
        redirect('/404');
    }
    //url like http://localhost:3000/track?trains=T1940DBHM+T1200DMAN
    const servicesToTrack = trains.split('+').map((train) => {
        const [depTime, destCode] = train.slice(1).split('D');
        return { depTime, destCode }
    });
    const [state, setState] = useState<TrackState>({
        data: {
            status: "Wait...",
            platform: "0",
        },
        hidden: {
            timeTillRefresh: 5
        }
    });
    return (
        <main className="flex min-h-screen h-full flex-col">
            <div className={`hidden ${maxWidthClassNames}`}></div>
            <div className={`navArea w-full pt-8 pb-4 md:pt-20 bg-zinc-900`}>
                <div className={`${maxWidthClassNames} flex flex-col gap-4 items-center`}>
                    <h2 className="font-semibold text-white text-2xl">Track train(s)</h2>
                </div>
            </div>
            <MainTrackingArea servicesToTrack={[]} />
        </main>
    )
}

export default TrackPage