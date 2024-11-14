import { Check, AlertTriangle, X, Eye } from 'lucide-react'
import { cn } from "@/lib/utils"

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

type DepartureListProps = {
    departures: Departure[];
    isLoading: boolean;
    selectedDeparture: number | null;
    setSelectedDeparture: (index: number | null) => void;
    to: Station | null;
}

export function DepartureList({ departures, isLoading, selectedDeparture, setSelectedDeparture, to }: DepartureListProps) {
    return (
        <div className="w-full bg-white bg-opacity-5 p-4 rounded-lg mb-6">
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
                                "bg-[#111111] p-4 rounded-lg flex justify-between items-center cursor-pointer transition-colors",
                                selectedDeparture === index ? 'ring-2 ring-teal-500' : ''
                            )}
                            onClick={() => setSelectedDeparture(index)}
                        >
                            <div className="flex-grow">
                                <span className="text-xl font-bold mr-2">{departure.scheduledDepartureTime}</span>
                                <span className="font-semibold">{departure.destination.name}</span>
                                {departure.status === "Go" && <Check className="inline-block w-4 h-4 ml-2 text-white opacity-20" />}
                                {departure.status === "Wait" && <Eye className="inline-block w-4 h-4 ml-2 text-white opacity-20" />}
                                {departure.status === "Changed" && <Check className="inline-block w-4 h-4 ml-2 text-white opacity-20" />}
                                {departure.status === "Error" && <AlertTriangle className="inline-block w-4 h-4 ml-2 text-white opacity-20" />}
                                {to && departure.callingAt.some(station => station.code === to.code) && (
                                    <div className="text-sm text-gray-400 mt-1">Calling at {to.name}</div>
                                )}
                            </div>
                            <div className="text-right flex flex-col items-end">
                                <span className="text-gray-400">
                                    {departure.provider.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </span>
                                <div className="flex">
                                    <span className="text-sm mr-2">Platform</span>
                                    <span className={`text-sm ${departure.status === "Wait" ? 'blur-sm' : ''}`}>
                                        {departure.status === "Wait" ? 'X' : departure.platform.number}
                                        {departure.status === "Wait" && (
                                            <span className="hidden">nice try</span>
                                        )}
                                    </span>
                                </div>
                                {selectedDeparture === index && (
                                    <X
                                        className="h-4 w-4 text-gray-400 mt-2 cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedDeparture(null);
                                        }}
                                    />
                                )}
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