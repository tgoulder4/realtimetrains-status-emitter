'use client'
import React, { useState } from 'react'
import WebSocket from 'ws';
import { env } from '@/env';
import { TrackState } from '@/lib/types';
import { maxWidthClassNames } from '@/lib/layout';
import MainTrackingArea from './mainTrackingArea';
import { redirect, useSearchParams } from 'next/navigation';
import { findStationNameByCode } from '@/lib/destinations';

type Props = {
    // searchParams: { [key: string]: string | string[] | undefined }
}

function TrackPage({ }: Props) {
    const sp = useSearchParams();
    const trains = sp.get('trains');
    console.log("trains found in url: ", trains)
    if (!trains) {
        console.error("No trains to track")
        redirect('/404');
    }
    const [selectedServiceToTrack, setSelectedServiceToTrack] = useState(0);
    //url like http://localhost:3000/track?trains=T-1940D-BHMA-MAN
    const servicesToTrack = trains.split('+').map((train) => {
        const matches = {
            depTime: train.match(/T-(\d{4})/)?.[1],
            depDestinationStation: train.match(/D-(\w{3})/)?.[1],
            aimStationCode: train.match(/A-(\w{3})/)?.[1]
        };
        for (const key in matches) {
            console.log("key: ", key)
            if (key === null || key === "null") {
                throw new Error(`No match found for ${key}`);
            }
        }
        const service = {
            departure: { depDestinationStation: matches.depDestinationStation as string, depDestinationStationName: findStationNameByCode(matches.depDestinationStation!) as string },
            scheduledDepartureTime: matches.depTime as string,
            aimStation: { code: matches.aimStationCode as string, name: findStationNameByCode(matches.aimStationCode!) }
        }
        return service;
    });
    console.log("servicesToTrack: ", servicesToTrack)
    return (
        <main className="flex h-full flex-col pb-48">
            <div className={`hidden ${maxWidthClassNames}`}></div>
            <div className={`navArea w-full pt-8 pb-0 md:pt-16 bg-zinc-900 text-white`}>
                <div className={`${maxWidthClassNames} flex flex-col justify-between gap-8 items-center`}>
                    <h2 className="font-semibold text-white text-2xl">Track train(s)</h2>
                    <div className="flex flex-row justify-start w-full gap-2">
                        {servicesToTrack.map((service, index) =>
                            //switcher
                            <div onClick={() => { setSelectedServiceToTrack(index) }} key={service.aimStation.name + service.scheduledDepartureTime} className="flex cursor-pointer hover:bg-white/5 flex-col gap-3">
                                <h3>{service.aimStation.name ? "Via " + service.aimStation.name : ""} </h3>
                                <div className="h-3 w-full bg-white/20"></div>
                            </div>)
                        }

                    </div>
                </div>
            </div>
            <MainTrackingArea serviceToTrack={servicesToTrack[selectedServiceToTrack]} />
        </main>
    )
}

export default TrackPage