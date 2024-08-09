'use client'
import { findStationCodeByName, findStationNameByCode, stationNamesWithCodes } from "@/lib/map";
import cheerio from 'cheerio'
import { useServerAction } from 'zsa-react'
import { checkTrueDestinationName } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { ComboBox } from "@/components/ui/combobox";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getServiceList, Service } from "../utils";
import { useRouter, useSearchParams } from "next/navigation";
import { maxWidthClassNames } from "@/lib/layout";
import { applicationName } from "@/app-config";
import { Input } from "@/components/ui/input";
import DepartureCard, { CardPrim } from "../Cards";
import { Button } from "@/components/ui/button";
import { findUniqueServices } from "@/lib/services";
function InputField({ leftText, value, className }: { leftText: string, value?: string, className?: string }) {
    return <div className={`w-full flex flex-row items-center gap-2 ${className}`}>
        <p className="opacity-40 text-sm text-white">{leftText}</p>
        <Input className="bg-zinc-800 border-zinc-800/90 text-white font-bold" value={value} placeholder="Select a station..." />
    </div>
}
export default function Home() {
    const sp = useSearchParams()
    const destination = sp.get('dest');
    const destinationName = findStationNameByCode(destination ? destination : '');
    const [departures, setDepartures] = useState<Service[]>([
        {
            destinationStationName: "Birmingham New Street",
            departureTime: "12:00",
            platform: "1",
            status: "On time",
            stationCode: "BHM"
        },
        {
            destinationStationName: "Manchester Piccadilly",
            departureTime: "12:00",
            platform: "1",
            status: "On time",
            stationCode: 'MAN'
        }
    ]);
    //select the string station codes for easy appending to the URL
    const [selectedDepartures, setSelectedDepartures] = useState<string[]>([]);

    useEffect(() => {
        async function main() {
            // const services = await getServiceList(destination ? destination : undefined);
            // setDepartures(destination ? services.slice(0, 8) : services);
        }
        main()
    }, []);
    return (
        <main className="flex min-h-screen h-full flex-col">
            <div className={`hidden ${maxWidthClassNames}`}></div>
            <div className={`navArea w-full pt-8 pb-4 md:pt-20 bg-zinc-900`}>
                <div className={`${maxWidthClassNames} flex flex-col gap-4 items-center`}>
                    <h2 className="font-semibold text-white text-2xl">{applicationName}</h2>
                    <div className="w-full flex flex-col gap-4">
                        <InputField value="London Euston" leftText="From:" />
                        <InputField className="pl-[17px]" value={destination ? destinationName : ''} leftText="To:" />
                    </div>
                </div>
            </div>
            <div className={`${maxWidthClassNames} flex flex-col h-full justify-between`}>
                <div className="px-12 pt-8 flex flex-col h-full gap-4">
                    <h2 className="font-semibold">{destination ? "Results" : "Departing soon"}</h2>
                    <div className="flex flex-col gap-4">
                        {departures.map(departure => <DepartureCard onClick={() => {
                            console.log("Appending station code " + departure.stationCode); setSelectedDepartures(prev => prev.includes(departure.stationCode) ?
                                prev.filter(code => code !== departure.stationCode)
                                : [...prev, departure.stationCode]);
                            console.log("Selected departures: ", selectedDepartures);
                        }} className={`${selectedDepartures.includes(departure.stationCode) ? "!bg-blue-300" : ""}`} via={destination || undefined} service={departure} />)}
                    </div>
                </div>
                {selectedDepartures.length && <div className="px-10 grid place-items-center"> <Button className="animate-in text-lg font-semibold  bg-green-900 border-b-8 border-green-950 hover:border-b-0 px-12 py-8 -translate-y-10 transition-transform ease-in text-white">Beat The Rush! ({selectedDepartures.length})</Button></div>}
            </div>
        </main>
    );
}
