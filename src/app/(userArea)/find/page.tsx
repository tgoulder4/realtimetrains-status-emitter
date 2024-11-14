'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DepartureList } from '@/components/DepartureList'
import { UserDialog } from '@/components/UserDialog'
import { motion } from 'framer-motion'
import { ClientLayout } from '@/components/ClientLayout'
import StationSelector from '@/components/StationSelector'


type Station = {
    code: string;
    name: string;
}

type Departure = {
    status: "Loading" | "Wait" | "Go" | "Changed" | "Error" | "Prepare";
    platform: {
        number: string;
    };
    scheduledDepartureTime: string;
    destination: Station;
    callingAt: Station[];
    provider: string;
}

const stations: Station[] = [
    { code: "EUS", name: "London Euston" },
    { code: "BHM", name: "Birmingham New Street" },
    { code: "TRI", name: "Tring" },
    { code: "WFJ", name: "Watford Junction" },
    { code: "MKC", name: "Milton Keynes Central" },
    { code: "COV", name: "Coventry" },
    { code: "LIV", name: "Liverpool Lime Street" },
    { code: "MAN", name: "Manchester Piccadilly" },
    { code: "GLA", name: "Glasgow Central" },
]


export default function FindPage() {
    const [from, setFrom] = useState<Station | null>(stations[0])
    const [to, setTo] = useState<Station | null>(null)
    const [selectedDeparture, setSelectedDeparture] = useState<number | null>(null)
    const [departures, setDepartures] = useState<Departure[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [credits, setCredits] = useState(100)
    const [showFirstTimeDialog, setShowFirstTimeDialog] = useState(false)
    const [activeTab, setActiveTab] = useState('account')

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            setDepartures([
                { status: "Wait", platform: { number: "1" }, scheduledDepartureTime: "13:16", destination: stations[1], callingAt: [stations[4], stations[1]], provider: "Avanti West Coast" },
                { status: "Wait", platform: { number: "3" }, scheduledDepartureTime: "13:24", destination: stations[2], callingAt: [stations[3], stations[2]], provider: "London Northwestern Railway" },
                { status: "Wait", platform: { number: "5" }, scheduledDepartureTime: "13:30", destination: stations[3], callingAt: [stations[3]], provider: "London Overground" },
                { status: "Wait", platform: { number: "2" }, scheduledDepartureTime: "13:45", destination: stations[1], callingAt: [stations[4], stations[5], stations[1]], provider: "Avanti West Coast" },
                { status: "Wait", platform: { number: "4" }, scheduledDepartureTime: "13:55", destination: stations[4], callingAt: [stations[3], stations[4]], provider: "London Northwestern Railway" },
                { status: "Wait", platform: { number: "6" }, scheduledDepartureTime: "14:10", destination: stations[6], callingAt: [stations[4], stations[1], stations[6]], provider: "Avanti West Coast" },
                { status: "Wait", platform: { number: "7" }, scheduledDepartureTime: "14:25", destination: stations[7], callingAt: [stations[4], stations[1], stations[7]], provider: "Avanti West Coast" },
                { status: "Wait", platform: { number: "8" }, scheduledDepartureTime: "14:40", destination: stations[8], callingAt: [stations[1], stations[5], stations[8]], provider: "Avanti West Coast" },
                { status: "Wait", platform: { number: "9" }, scheduledDepartureTime: "14:55", destination: stations[5], callingAt: [stations[4], stations[5]], provider: "West Midlands Trains" },
                { status: "Wait", platform: { number: "10" }, scheduledDepartureTime: "15:10", destination: stations[7], callingAt: [stations[4], stations[1], stations[7]], provider: "TransPennine Express" },
            ])
            setIsLoading(false)
        }, 2000)
    }, [])

    const filteredDepartures = to
        ? departures.filter(d => d.destination.code === to.code || d.callingAt.some(station => station.code === to.code))
        : departures


    const handleBeatTheRush = () => {
        const isFirstTime = localStorage.getItem('isFirstTime') !== 'false'
        if (isFirstTime) {
            setShowFirstTimeDialog(true)
            localStorage.setItem('isFirstTime', 'false')
        }
        console.log("Beat the Rush clicked!")
    }
    return (
        <ClientLayout>

            <Card className="hidden mx-4 mt-4 bg-white bg-opacity-5 text-white border-0">
                <CardHeader>
                    <CardTitle className="text-2xl">You're guaranteed a seat every time!</CardTitle>
                    <CardDescription className="text-white text-opacity-90">
                        Beat the rush by seeing your train's platform before it's announced to everyone else.
                    </CardDescription>
                </CardHeader>
            </Card>

            <div className="flex-grow flex flex-col lg:flex-row items-stretch px-4 py-8 pb-32 lg:pb-8 max-w-6xl mx-auto w-full">
                <div className="w-full lg:w-1/3 lg:mr-8 mb-8 lg:mb-0">
                    <div className="space-y-4 lg:sticky lg:top-8">

                        <StationSelector
                        readOnly
                            label="From"
                            value={from}
                            onChange={setFrom}
                            stations={stations}
                        />
                        <StationSelector
                            label="To"
                            value={to}
                            onChange={setTo}
                            stations={stations}
                            allowClear
                        />
                    </div>
                </div>

                <div className="w-full lg:w-2/3">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        {to ? 'Search results' : 'Non-announced platforms'}
                        {!to && (
                            <motion.div
                                className="flex items-center ml-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                            >
                                <div className="relative">
                                    <div className="absolute w-2 h-2 bg-red-500 rounded-full opacity-75 animate-ping"></div>
                                    <div className="relative w-2 h-2 bg-red-500 rounded-full"></div>
                                </div>
                                <span className="text-xs font-semibold text-red-500 ml-1">LIVE</span>
                            </motion.div>
                        )}
                    </h2>

                    <DepartureList
                        departures={filteredDepartures}
                        isLoading={isLoading}
                        selectedDeparture={selectedDeparture}
                        setSelectedDeparture={setSelectedDeparture}
                        to={to}
                    />

                    <div className="hidden lg:block lg:mb-12">
                        <Button
                            className="text-lg w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-6 rounded-lg transition-colors disabled:bg-gray-500"
                            disabled={selectedDeparture === null || isLoading}
                            onClick={handleBeatTheRush}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading
                                </>
                            ) : (
                                "Beat the Rush"
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#111111] lg:hidden">
                <div className="max-w-6xl mb-12 mx-auto">
                    <Button
                        className="text-lg w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-6 rounded-lg transition-colors disabled:bg-gray-500"
                        disabled={selectedDeparture === null || isLoading}
                        onClick={handleBeatTheRush}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading
                            </>
                        ) : (
                            "Beat the Rush"
                        )}
                    </Button>
                </div>
            </div>
        </ClientLayout>
    )
}