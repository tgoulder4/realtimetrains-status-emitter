'use client'
import { findStationCodeByName, findStationNameByCode, stationNamesWithCodes } from "@/lib/map";
import cheerio from 'cheerio'
import { useServerAction } from 'zsa-react'
import { addIfNewOrRemoveIfExistingItemFromArray, cn } from "@/lib/utils";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form'
import { ComboBox } from "@/components/ui/combobox";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getServiceList } from "../../lib/core/main";
import { Service } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { maxWidthClassNames } from "@/lib/layout";
import { applicationName } from "@/app-config";
import { Input } from "@/components/ui/input";
import DepartureCard, { CardPrim } from "../Cards";
import { Button } from "@/components/ui/button";
import { checkTrueDestinationName } from "@/lib/destinations";
import { findUniquelyNamedDepartures } from "@/lib/departures";
import DeparturesComboBoxFormField from "./departuresComboBoxFormField";


export default function Home() {
    const sp = useSearchParams()
    const destination = sp.get('dest');
    const destinationName = findStationNameByCode(destination ? destination : '');
    console.log("destinationName: ", destinationName)
    //header form stuff
    const formSchema = z.object({ dest: z.string().length(3), dep: z.literal("London Euston") });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dest: destination || '',
            dep: 'London Euston'
        }
    })
    function onSubmit(data: z.infer<typeof formSchema>) {
        console.log("onSubmit called with data: ", data)
        window.location.href = `/find?dest=${data.dest}`
    }


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
                    <Form {...form}>
                        <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="w-full flex flex-col gap-4">
                                <div className="flex flex-row gap-2">
                                    <div className={`w-full flex flex-row items-center gap-2`}>
                                        <p className="opacity-40 text-sm text-white">From:</p>
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
                                        <p className="opacity-40 text-sm text-white">To:</p>
                                        <DeparturesComboBoxFormField onSubmit={onSubmit} options={findUniquelyNamedDepartures(departures).map(station => ({ label: station.destinationStationName, value: station.stationCode }))} form={form} />
                                    </div>
                                </div>
                            </div>

                        </form>
                    </Form>
                    {/* form here */}
                </div>
            </div>
            <div className={`${maxWidthClassNames} flex flex-col h-full justify-between`}>
                <div className="px-12 pt-8 flex flex-col h-full gap-4">
                    <h2 className="font-semibold">{destination ? "Results" : "Departing soon"}</h2>
                    <div className="flex flex-col gap-4">
                        {departures.map(departure =>
                            <DepartureCard onClick={() => {
                                setSelectedDepartures(prev => addIfNewOrRemoveIfExistingItemFromArray(prev, departure.stationCode))
                            }} className={`${selectedDepartures.includes(departure.stationCode) ? "!bg-blue-300" : ""}`} via={destination || undefined} service={departure} />)
                        }
                    </div>
                </div>
                {selectedDepartures.length && <div className="px-10 grid place-items-center">
                    <Button className="animate-in text-lg font-semibold  bg-green-900 border-b-8 border-green-950 hover:border-b-0 px-12 py-8 -translate-y-10 transition-transform ease-in text-white">
                        Beat The Rush! ({selectedDepartures.length})
                    </Button>
                </div>}
            </div>
        </main >
    );
}
