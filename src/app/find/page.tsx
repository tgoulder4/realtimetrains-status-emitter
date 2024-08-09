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
import ServiceInfoCard, { CardPrim } from "../Cards";
import { Button } from "@/components/ui/button";
/**
 * 
 * @param srvcs 
 * @returns Unique services. Errors are "MULTIDEST" for multiple destinations.
 */
function findUniqueServices(srvcs: Service[]): Service[] {
    return srvcs.map(station => {
        const stationName = station.destinationStationName;
        //if stationanme contains a comma or an and symbol throw an error
        if (stationName.includes(',') || stationName.includes('&')) {
            return { destinationStationName: "MULTIDEST", departureTime: "--", platform: "0", status: "Error", stationCode: "--" };
        } else {
            return station
        }
    }).filter((value, index, self) => {
        return srvcs.findIndex(station => station.destinationStationName === value.destinationStationName) === index;
    })
}
function InputField({ leftText, value, className }: { leftText: string, value?: string, className?: string }) {
    return <div className={`w-full flex flex-row items-center gap-2 ${className}`}>
        <p className="opacity-40 text-sm text-white">{leftText}</p>
        <Input className="bg-zinc-800 border-zinc-800/90 text-white font-bold" value={value} placeholder="Select a station..." />
    </div>
}
export default function Home() {
    // const { execute, isPending, error } = useServerAction(submitDestinationSA);
    const formSchema = z.object({ dest: z.string() });
    // const form = useForm<z.infer<typeof formSchema>>({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         dest: 'BHM',
    //     }
    // });
    const sp = useSearchParams()
    const destination = sp.get('dest');
    const [servicesFromEuston, setServicesFromEuston] = useState<Service[]>([
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
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    useEffect(() => {
        async function main() {
            // const services = await getServiceList(destination ? destination : undefined);
            // setServicesFromEuston(destination ? services.slice(0, 8) : services);
        }
        main()
    }, []);
    const [errors, setErrors] = useState<string[]>([""]);
    const uniqueServicesFromEuston: Service[] = findUniqueServices(servicesFromEuston)
        .filter(station => {
            if (station.destinationStationName === "MULTIDEST") {
                setErrors(prev => ([...prev, "Some destinations aren't available as multiple destinations aren't yet supported."]));
            }
            return station.destinationStationName !== "MULTIDEST";
        })
    console.log("uniqueServicesFromEuston: ", uniqueServicesFromEuston);


    //make a headerarea component then abstract it. make it here then once it's done move it to a diferent file.
    return (
        <main className="flex min-h-screen flex-col h-full">
            <div className={`hidden ${maxWidthClassNames}`}></div>
            <div className={`navArea w-full pt-8 pb-4 md:pt-20 bg-zinc-900`}>
                <div className={`${maxWidthClassNames} flex flex-col gap-4 items-center`}>
                    <h2 className="font-semibold text-white text-2xl">{applicationName}</h2>
                    <div className="w-full flex flex-col gap-4">
                        <InputField value="London Euston" leftText="From:" />
                        <InputField className="pl-[17px]" value={destination ? findStationNameByCode(destination) : ''} leftText="To:" />
                    </div>
                </div>
            </div>
            <div className={`${maxWidthClassNames} flex flex-col h-full justify-between`}>
                <div className="px-12 pt-8 flex flex-col gap-4">
                    <h2 className="font-semibold">{destination ? "Results" : "Departing soon"}</h2>
                    <DeparturesList setSelectedServices={setSelectedServices} selectedServices={selectedServices} services={uniqueServicesFromEuston} via={destination ? destination : undefined} />
                </div>
                {selectedServices.length && <div className="px-10 grid place-items-center"> <Button className="animate-in text-lg font-semibold  bg-green-900 border-b-8 border-green-950 hover:border-b-0 px-12 py-8 -translate-y-10 transition-transform ease-in text-white">Beat The Rush! ({selectedServices.length})</Button></div>}
            </div>
            {errors?.map(err => <CardPrim className="bg-red-900"><p className="text-white">{err}</p></CardPrim>)}
        </main>
    );
}

function DeparturesList({ services, selectedServices, via, setSelectedServices }: { services: Service[], selectedServices: string[], via?: string, setSelectedServices: Dispatch<SetStateAction<string[]>> }) {
    return (
        <div className="flex flex-col gap-4">
            {services.map(service => <ServiceInfoCard onClick={() => {
                console.log("Appending station code " + service.stationCode); setSelectedServices(prev => prev.includes(service.stationCode) ?
                    prev.filter(code => code !== service.stationCode)
                    : [...prev, service.stationCode])
            }} className={`${selectedServices.includes(service.stationCode) ? "bg-blue-300" : ""}`} service={service} />)}
        </div>
    )
}