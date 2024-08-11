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
    //url like http://localhost:3000/track?trains=T1940DBHMAMAN
    const servicesToTrack = trains.split('+').map((train) => {
        //get time
        const depTime = train.slice(1, 5);
        console.log("depTime: ", depTime)
        //get destination code up to char before A
        const depDestinationStation = train.slice(6, -4)
        console.log("depDestinationStation: ", depDestinationStation)
        const depDestinationStationName = findStationNameByCode(depDestinationStation);
        //get aim station
        const aimStation = train.slice(-3)
        console.log("aimStation: ", aimStation)
        const aimStationName = findStationNameByCode(aimStation);
        return {
            scheduledDepartureTime:
                //insert a  : in the middle of the string
                depTime.slice(0, 2) + ":" + depTime.slice(2)
            , departure: { depDestinationStation, depDestinationStationName }, aimStation: { code: aimStation, name: aimStationName }
        }
    });
    console.log("servicesToTrack: ", servicesToTrack)
    return (
        <main className="flex h-full flex-col">
            <div className={`hidden ${maxWidthClassNames}`}></div>
            <div className={`navArea w-full pt-8 pb-0 md:pt-16 bg-zinc-900 text-white`}>
                <div className={`${maxWidthClassNames} flex flex-col justify-between gap-8 items-center`}>
                    <h2 className="font-semibold text-white text-2xl">Track train(s)</h2>
                    <div className="flex flex-row justify-start w-full gap-2">
                        {servicesToTrack.map((service, index) =>
                            //switcher
                            <div onClick={() => { setSelectedServiceToTrack(index) }} key={service.aimStation.name + service.scheduledDepartureTime} className="flex cursor-pointer hover:bg-white/5 flex-col gap-3">
                                <h3>Via {service.aimStation.name}</h3>
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