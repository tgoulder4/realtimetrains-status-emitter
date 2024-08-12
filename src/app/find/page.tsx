'use client'
import { stationNamesWithCodes } from "@/lib/map";
import cheerio from 'cheerio'
import { useServerAction } from 'zsa-react'
import { addIfNewOrRemoveIfExistingItemFromArray, cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { ComboBox } from "@/components/ui/combobox";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getServiceListCA } from "../../core-actions/main";
import { Service } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { maxWidthClassNames } from "@/lib/layout";
import { applicationName } from "@/app-config";
import { Input } from "@/components/ui/input";
import DepartureCard, { CardPrim } from "../Cards";
import { Button } from "@/components/ui/button";
import { checkTrueStationName, findStationCodeByName, findStationNameByCode } from "@/lib/destinations";
import { findUniquelyNamedDepartures } from "@/lib/departures";
import DeparturesComboBoxFormField from "./departuresComboBoxFormField";


export default function Home() {
    //header form stuff
    const formSchema = z.object({ dest: z.string().length(3).or(z.string().length(0)), dep: z.literal("London Euston") });
    function handleBeatTheRushClick() {
        //shake the cards of class departureCard

    }


    const [departures, setDepartures] = useState<Service[]>([
        {
            destination: { name: "Birmingham New Street", code: "BHM" },
            scheduledDepartureTime: "12:00",
            platform: {
                number: "1",
                type: "confirmedAndChanged"
            },
            status: "Wait",
            provider: "Avanti West Coast"
        },
        {
            destination: { name: "Birmingham New Street", code: "BHM" },
            scheduledDepartureTime: "13:00",
            platform: {
                number: "1",
                type: "confirmedAndChanged"
            },
            status: "Wait",
            provider: "Avanti West Coast"
        }
    ]);
    const [renderedDepartures, setRenderedDepartures] = useState<Service[]>([
        {
            destination: { name: "LOAD", code: "LOAD" },
            scheduledDepartureTime: "LOAD",
            platform: {
                number: "LOAD",
                type: "confirmedAndChanged"
            },
            status: "Go",
            provider: "Avanti West Coast"
        },
        {
            destination: { name: "LOAD", code: "LOAD" },
            scheduledDepartureTime: "LOAD",
            platform: {
                number: "LOAD",
                type: "confirmedAndChanged"
            },
            status: "Go",
            provider: "Avanti West Coast"
        },
        {
            destination: { name: "LOAD", code: "LOAD" },
            scheduledDepartureTime: "LOAD",
            platform: {
                number: "LOAD",
                type: "confirmedAndChanged"
            },
            status: "Go",
            provider: "Avanti West Coast"
        },
    ]);
    const [aimStation, setAimStation] = useState<{ name: string, code: string }>({ name: "", code: "" });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dest: '',
            dep: 'London Euston'
        }
    })
    async function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("onSubmit called with data: ", data)
        const aimStationCode = data.dest;
        if (aimStationCode) {
            const services = await getServiceListCA(aimStationCode);
            setRenderedDepartures(services.slice(0, 8));
        } else {
            setRenderedDepartures(departures);
        }
        setAimStation({ name: findStationNameByCode(aimStationCode), code: aimStationCode });
    }
    //select the string station codes for easy appending to the URL
    const [selectedDepartures, setSelectedDepartures] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        async function main() {
            const allServices = await getServiceListCA();
            setDepartures(allServices);
            setRenderedDepartures(allServices);
        }
        main()
    }, []);
    return (
        <main className="flex min-h-fit flex-col pb-48">
            <div className={`hidden ${maxWidthClassNames}`}></div>
            <div className={`navArea sticky top-0 left-0 z-10 w-full pt-8 pb-4 md:pt-16 bg-zinc-900`}>
                <div className={`${maxWidthClassNames} flex flex-col gap-8 items-center`}>
                    <h2 className="font-semibold text-white text-2xl">{applicationName}</h2>
                    <Form {...form}>
                        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="w-full flex flex-col gap-4">
                                <div className="flex flex-row gap-2">
                                    <div className={`w-full flex flex-row items-center gap-2`}>
                                        <p className="opacity-40  text-white">From:</p>
                                        <FormField
                                            control={form.control}
                                            name="dep"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input {...field} readOnly className="bg-zinc-800 border-zinc-800/90 text-white font-bold" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="pl-[17px] flex flex-row gap-2">
                                    <div className={`w-full flex flex-row items-center gap-2`}>
                                        <p className="opacity-40  text-white">To:</p>
                                        <DeparturesComboBoxFormField onSubmit={onSubmit} _options={findUniquelyNamedDepartures(departures).map(station => ({ label: station.destination.name, value: station.destination.code }))} form={form} />
                                    </div>
                                </div>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
            <div className={`${maxWidthClassNames}  flex flex-col h-full justify-between`}>
                <div className="px-12 pt-8 flex flex-col h-full gap-4">
                    <h2 className="font-semibold">{aimStation ? "Results" : "Departing soon"}</h2>
                    <div className="flex flex-col gap-4">
                        {renderedDepartures.map((departure, index) => {
                            const { destination } = departure;
                            const selectedDepInfo = "T-" + departure.scheduledDepartureTime.replace(":", "") + "D-" + destination.code + (aimStation.code ? "A-" + aimStation.code : "");
                            console.log("selectedDepInfo: ", selectedDepInfo)
                            if (departure.destination.name == "LOAD") return <div key={"load-" + index} className="bg-zinc-200 animate animate-pulse h-20 w-full"></div>
                            return <DepartureCard
                                key={departure.scheduledDepartureTime + departure.destination.name}
                                onClick={() => { setSelectedDepartures(prev => addIfNewOrRemoveIfExistingItemFromArray(prev, selectedDepInfo)) }}
                                className={`${selectedDepartures.includes(selectedDepInfo) ? "!bg-blue-300" : ""} ${error && "animate-[shake] duration-700 animate-once transition-colors bg-red-400"}`}
                                partialDepartureInfo={{
                                    destination: departure.destination,
                                    scheduledDepartureTime: departure.scheduledDepartureTime,
                                    provider: departure.provider,
                                    via: aimStation.name == destination.name ? undefined : aimStation.name || undefined
                                }} />
                        }
                        )
                        }
                    </div>
                </div>
                {/* <div className="grid place-items-center"> */}
                <Button
                    onClick={() => {
                        if (selectedDepartures.length == 0) { setError("Please select at least one departure"); }
                        else { window.location.href = `/track?trains=${selectedDepartures.join("+")}` }
                    }}
                    className={`animate-in fixed bottom-12 left-[calc(50%_-_120px)] text-lg font-semibold ${selectedDepartures.length > 0 ? "bg-green-900 border-b-8 border-green-950 hover:border-b-0 -translate-y-2" : ""}  px-12 py-8  transition-transform ease-in text-white`}>
                    Beat The Rush! {selectedDepartures.length > 0 && `(${selectedDepartures.length})`}
                </Button>
                {/* </div> */}
            </div>
        </main >
    );
}
