'use server'
import React, { useState } from 'react'
import WebSocket from 'ws';
import { env } from '@/env';
import { TrackState } from '@/lib/types';
import { maxWidthClassNames } from '@/lib/layout';
import MainTrackingArea from './mainTrackingArea';
import { redirect } from 'next/navigation';
import { findDestinationNameByCode } from '@/lib/destinations';

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
    console.log("servicesToTrack: ", servicesToTrack)
    return (
        <main className="flex h-full flex-col">
            <div className={`hidden ${maxWidthClassNames}`}></div>
            <div className={`navArea w-full pt-8 pb-0 md:pt-20 bg-zinc-900 text-white`}>
                <div className={`${maxWidthClassNames} flex flex-col justify-between gap-4 items-center`}>
                    <h2 className="font-semibold text-white text-2xl">Track train(s)</h2>
                    <div className="flex flex-row justify-start w-full gap-2">
                        {servicesToTrack.map((service, index) =>
                            //switcher
                            <div className="flex flex-col gap-3">
                                <h3>{findDestinationNameByCode(service.destCode)}</h3>
                                <div className="h-3 w-full bg-white/20"></div>
                            </div>)
                        }

                    </div>
                </div>
            </div>
            <MainTrackingArea servicesToTrack={servicesToTrack} />
        </main>
    )
}

export default TrackPage