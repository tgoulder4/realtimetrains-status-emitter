'use client'

import { useState, useEffect, useMemo } from 'react'
import { Loader2, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DepartureList } from '@/components/DepartureList'
import { motion } from 'framer-motion'
import { ClientLayout } from '@/components/ClientLayout'
import StationSelector from '@/components/StationSelector'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { fullApplicationName } from '@/app-config'

type Station = {
    code: string;
    name: string;
}

type Departure = {
    status: "Wait" | "Go" | "Prepare" | "Unknown";
    platform: {
        number: string;
    };
    scheduledDepartureTime: string;
    destination: Station;
    callingAt: Station[];
    provider: string;
    Trainpeekcount: number;
    tId: string;
}

// const stations: Station[] = [
//     { code: "EUS", name: "London Euston" },
//     { code: "BHM", name: "Birmingham New Street" },
//     { code: "TRI", name: "Tring" },
//     { code: "WFJ", name: "Watford Junction" },
//     { code: "MKC", name: "Milton Keynes Central" },
//     { code: "COV", name: "Coventry" },
//     { code: "LIV", name: "Liverpool Lime Street" },
//     { code: "MAN", name: "Manchester Piccadilly" },
//     { code: "GLA", name: "Glasgow Central" },
// ]
// // Mock departures data
// const mockDepartures: Departure[] = [
//     {
//         tId: "A1B2",
//         status: "Wait",
//         platform: { number: "1" },
//         scheduledDepartureTime: "10:30",
//         destination: stations[1],
//         callingAt: [stations[3], stations[4], stations[5]],
//         provider: "Avanti West Coast",
//         Trainpeekcount: 5
//     },
//     {
//         tId: "C3D4",
//         status: "Prepare",
//         platform: { number: "3" },
//         scheduledDepartureTime: "11:00",
//         destination: stations[6],
//         callingAt: [stations[2], stations[4], stations[5]],
//         provider: "London Northwestern Railway",
//         Trainpeekcount: 3
//     },
//     {
//         tId: "E5F6",
//         status: "Go",
//         platform: { number: "6" },
//         scheduledDepartureTime: "11:15",
//         destination: stations[7],
//         callingAt: [stations[3], stations[5], stations[6]],
//         provider: "Avanti West Coast",
//         Trainpeekcount: 8
//     },
//     {
//         tId: "G7H8",
//         status: "Unknown",
//         platform: { number: "TBA" },
//         scheduledDepartureTime: "11:45",
//         destination: stations[8],
//         callingAt: [stations[1], stations[5], stations[7]],
//         provider: "Avanti West Coast",
//         Trainpeekcount: 2
//     }
// ]



export default function FindPage() {
    const [from, setFrom] = useState<Station | null>(null)
    const [to, setTo] = useState<Station | null>(null)
    const [selectedDeparture, setSelectedDeparture] = useState<number | null>(null)
    const [departures, setDepartures] = useState<Departure[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showFirstTimeDialog, setShowFirstTimeDialog] = useState(false);
    const [showCreditsDialog, setShowCreditsDialog] = useState(false)
    const [activeTab, setActiveTab] = useState('account')
    console.log('selectedDeparture', selectedDeparture)

    useEffect(() => {
        const briefed = localStorage.getItem('briefed')
        if (!briefed) setShowFirstTimeDialog(true)
    }, [])

    useEffect(() => {
        const fetchDepartures = async () => {
            try {
                const response = await fetch('/api/departures')
                if (!response.ok) {
                    throw new Error('Failed to fetch departures')
                }
                const data: Departure[] = await response.json()
                return data
            } catch (error) {
                console.error('Error fetching departures:', error)
                return []
            }
            // await new Promise(resolve => setTimeout(resolve, 1000))
            // return mockDepartures;
        }

        const main = async () => {
            console.log('fetching departures')
            setIsLoading(true)
            const fetchedDepartures = await fetchDepartures()
            setDepartures(fetchedDepartures)
            setIsLoading(false)
        }

        main()
        const interval = setInterval(main, 30000)  // Refresh every 30 seconds

        return () => clearInterval(interval)
    }, [])

    const availableStations = useMemo(() => {
        const uniqueStations = new Set<Station>()
        departures.forEach(dep => {
            uniqueStations.add(dep.destination)
            dep.callingAt.forEach(station => uniqueStations.add(station))
        })
        return Array.from(uniqueStations)
    }, [departures]);
    console.log('availableStations', availableStations)
    const handleSetTo = (station: Station | null) => {
        setTo(station)
        if (station) {
            setSelectedDeparture(null) // Reset selected departure when changing destination
        }
    }
    const filteredDepartures = to
        ? departures.filter(d => d.destination.code === to.code || d.callingAt.some(station => station.code === to.code))
        : departures


    const handleBeatTheRush = () => {
        console.log('setting showCreditsDialog to true')
        setShowCreditsDialog(true)

        console.log(`Reveal platform clicked!`)
    }
    return (
        <>
            <ClientLayout>
                <Card className="hidden mx-4 mt-4 bg-white bg-opacity-5 text-white border-0">
                    <CardHeader>
                        <CardTitle className="text-2xl">You're guaranteed a seat every time!</CardTitle>
                        <CardDescription className="text-white text-opacity-90">
                            See your train's platform before it's announced to everyone else.
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
                                stations={availableStations}
                            />
                            <StationSelector
                                label="To"
                                value={to}
                                onChange={setTo}
                                stations={availableStations.filter(station => station.code !== 'EUS')}
                                allowClear
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-2/3">
                        <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
                            <span>{to ? 'Search results' : 'Choose a departure'}</span>
                            <div className="flex items-center">
                                {isLoading && (
                                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                                )}
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
                            </div>
                        </h2>

                        <DepartureList
                            departures={filteredDepartures}
                            isLoading={isLoading}
                            selectedDeparture={selectedDeparture}
                            setSelectedDeparture={setSelectedDeparture}
                            to={to}
                        />

                        <div className="hidden sticky bottom-10 bg-[#111111] lg:block lg:mb-12">
                            <Button
                                className="text-lg w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-6 rounded-none transition-colors disabled:bg-gray-500"
                                disabled={selectedDeparture === null || isLoading}
                                onClick={handleBeatTheRush}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Loading
                                    </>
                                ) : (
                                    selectedDeparture === null ? "Select a departure" : "Beat the Rush"
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#111111] lg:hidden">
                    <div className="max-w-6xl mb-12 mx-auto">
                        <Button
                            className="text-lg w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-6 rounded-none transition-colors disabled:bg-gray-500"
                            disabled={selectedDeparture === null || isLoading}
                            onClick={handleBeatTheRush}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Loading
                                </>
                            ) : (
                                selectedDeparture === null ? "Select a departure" : "Beat the Rush"
                            )}
                        </Button>
                    </div>
                </div>
            </ClientLayout>
            <Dialog open={showFirstTimeDialog} onOpenChange={setShowFirstTimeDialog}>
                <DialogContent className="bg-[#222222] text-white rounded-none">
                    <DialogHeader>
                        <div className="flex">
                            <Badge className="mb-2 text-white bg-black inline-flex items-center px-2 py-1 w-auto">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>LONDON EUSTON</span>
                            </Badge>
                        </div>
                        <DialogTitle className="text-2xl font-bold mb-4">Ready to Beat the Rush? 🏃‍♂️💨</DialogTitle>
                        <DialogDescription className="text-lg text-gray-300">
                            Here's what you need to know:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <p className="flex items-start font-normal">
                            <span className="text-teal-500 mr-2">1.</span>
                            <span>We got sick of having to wait around and rush to our platforms, we wanted to make a change.</span>
                        </p>
                        <p className="flex items-start font-normal">
                            <span className="text-teal-500 mr-2">2.</span>
                            <span>Our automated agents work tirelessly behind the scenes, processing platform updates in real-time, so you don't have to wait around.</span>
                        </p>
                        <p className="flex items-start font-normal">
                            <span className="text-teal-500 mr-2">3.</span>
                            <span>While our agents are hard at work, your credits will decrease by 1 every minute as they search for the latest platform updates.</span>
                        </p>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button onClick={() => { setShowFirstTimeDialog(false); localStorage.setItem('briefed', 'true') }} className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-none">
                            Let's Do This!
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
                <DialogContent className="bg-[#222222] text-white rounded-none">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold mb-4 text-center">10 free credits! 🎉</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 text-center space-y-4">
                        <p className="text-sm">Remember, your credits will decrease by 1 every minute while we search for the latest platform updates.</p>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button onClick={() => {
                            setShowCreditsDialog(false); window.location.href = `/track/EUS?trains=${departures[selectedDeparture!].tId}&aimStation=${selectedDeparture !== null ? departures[selectedDeparture!].destination.code : ''
                                }`
                        }} className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-none">
                            Got it!
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}