import React from 'react'
import { Check, AlertTriangle, X, Eye, Hourglass, ArrowRight } from 'lucide-react'
import { cn } from "@/lib/utils"
import { BusinessIndicator } from './BusinessIndicator'
import StatusGlyph from './statusGlyph'

type Station = {
    code: string;
    name: string;
}

type Departure = {
    status: "Prepare" | "Wait" | "Go" | "Unknown";
    platform: {
        number: string;
    };
    scheduledDepartureTime: string;
    destination: Station;
    callingAt: Station[];
    provider: string;
    Trainpeekcount: number;
}

type DepartureListProps = {
    departures: Departure[];
    isLoading: boolean;
    selectedDeparture: number | null;
    setSelectedDeparture: (index: number | null) => void;
    to: Station | null;
}

export function DepartureList({ departures, isLoading, selectedDeparture, setSelectedDeparture, to }: DepartureListProps) {
    return (
        <div className="w-full bg-white bg-opacity-5 p-4 rounded-0 mb-6">
            <div className="space-y-4">
                {isLoading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="bg-[#111111] p-4 rounded-lg flex justify-between items-center">
                            <div className="animate-pulse flex space-x-4 w-full">
                                <div className="flex-1 space-y-4 py-1">
                                    <div className="h-3 bg-gray-700 bg-opacity-20 rounded w-1/4"></div>
                                    <div className="space-y-2">
                                        <div className="h-3 bg-gray-700 bg-opacity-20 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-700 bg-opacity-20 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : departures.length > 0 ? (
                    departures.map((departure, index) => (
                        <div
                            key={index}
                            className={cn(
                                "bg-[#111111] p-4 rounded-0 flex justify-between items-center cursor-pointer transition-colors",
                                selectedDeparture === index ? 'ring-2 ring-teal-500' : ''
                            )}
                            onClick={() => setSelectedDeparture(selectedDeparture === index ? null : index)}
                        >
                            <div className="flex-grow">
                                <span className="text-xl font-bold mr-2 text-white">{departure.scheduledDepartureTime}</span>
                                <span className="font-semibold text-white">{departure.destination.name}</span>
                                <StatusGlyph status={departure.status} />
                                {to && departure.callingAt.some(station => station.code === to.code) && (
                                    <div className="text-sm text-gray-400 mt-1">Calling at {to.name}</div>
                                )}
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <BusinessIndicator count={departure.Trainpeekcount} />
                                <span className="mt-2 text-white text-opacity-70">
                                    {departure.provider.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-400">No departures available</div>
                )}
            </div>
        </div>
    )
}