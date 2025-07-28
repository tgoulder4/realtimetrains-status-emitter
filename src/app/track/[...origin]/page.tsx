'use client'
import { useTrackState } from "@/lib/hooks/useTrackState"
import { Train } from "lucide-react"
import { useEffect, useState } from "react"
import { getDescriptionFromStatus, } from "./get-attributes-from-status"
import { useSearchParams } from "next/navigation"

function getColorFromStatus(status: string): string {
    switch (status) {
        case "Wait":
            return "bg-yellow-600"
        case "Go":
            return "bg-green-600"
        case "Prepare":
            return "bg-blue-600"
        case "Error":
            return "bg-red-600"
        default:
            return "bg-gray-600"
    }
}
function getGlyphFromStatus(status: string) {
    switch (status) {
        case "Wait":
            return <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.6667 2.3335H16.3333" stroke="currentColor" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 16.3335L17.5 12.8335" stroke="currentColor" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 25.6667C19.1546 25.6667 23.3333 21.488 23.3333 16.3333C23.3333 11.1787 19.1546 7 14 7C8.84533 7 4.66666 11.1787 4.66666 16.3333C4.66666 21.488 8.84533 25.6667 14 25.6667Z" stroke="currentColor" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        case "Go":
            return <svg width="16" height="16" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 7L8.16671 19.8333L2.33337 14" stroke="currentColor" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M25.6666 11.6665L16.9166 20.4165L15.1666 18.6665" stroke="currentColor" strokeOpacity="0.8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        case "Prepare":
            return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" opacity={50} xmlns="http://www.w3.org/2000/svg">
                <path d="M5 22H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 2H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17 22V17.828C16.9999 17.2976 16.7891 16.789 16.414 16.414L12 12L7.586 16.414C7.2109 16.789 7.00011 17.2976 7 17.828V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 2V6.172C7.00011 6.70239 7.2109 7.21101 7.586 7.586L12 12L16.414 7.586C16.7891 7.21101 16.9999 6.70239 17 6.172V2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        default:
            return <></>
    }
}
function getLighterColorFromStatus(status: string): string {
    switch (status) {
        case "Wait":
            return "bg-yellow-500"
        case "Go":
            return "bg-green-500"
        case "Prepare":
            return "bg-blue-500"
        case "Error":
            return "bg-red-400"
        default:
            return "bg-gray-500"
    }
}

function getTimeKeepingStatusColor(status: string): string {
    switch (status) {
        case 'OnTime':
            return 'bg-green-500/10 text-white'
        case 'Late':
            return 'bg-red-500/10 text-white'
        case 'Early':
            return 'bg-blue-500/10 text-white'
        case 'Cancelled':
            return 'bg-gray-500 text-white'
        default:
            return 'bg-gray-300/10 text-gray-800'
    }
}

export default function TrackPage({ params }: { params: { origin: string } }) {
    const searchParams = useSearchParams();
    const depId = searchParams.get("trains")
    console.log("dep Id:", depId)
    console.log("origin:", params.origin)
    const { trackingState, error } = useTrackState({
        departureId: depId as string,
        origin: params.origin,
        userId: "user-id" // This should come from your auth context
    })

    const [timeLeft, setTimeLeft] = useState(0)
    const [isWhiteBoxVisible, setIsWhiteBoxVisible] = useState(false)

    useEffect(() => {
        if (trackingState) {
            setTimeLeft(trackingState.millisecondsTilRefresh)
        }
    }, [trackingState])

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 0) {
                    return 0
                }
                return prevTime - 1000
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])


    if (!trackingState) {
        return (
            <div className="flex min-h-screen flex-col bg-[#111111] text-white">
                <main className="flex-1">
                    <div className="container mx-auto px-4 py-6">
                        <div className="mb-8 text-center">
                            <div className="flex justify-center mb-4">
                                <Train className="h-6 w-6" />
                            </div>
                            <h1 className="text-xl font-semibold">Track platform</h1>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white bg-opacity-[0.02]  p-4 mb-4 animate-pulse">
                                <div className="h-6 bg-gray-300 bg-opacity-10  w-1/2 mb-2"></div>
                                <div className="h-4 bg-gray-300 bg-opacity-10  w-3/4"></div>
                            </div>

                            <div className="bg-gray-600 bg-opacity-[0.02] p-8 text-center mb-4 animate-pulse">
                                <div className="mb-6 h-4 bg-gray-300 bg-opacity-10  w-1/4 mx-auto"></div>
                                <div className="mb-8 h-32 bg-gray-300 bg-opacity-10  w-1/2 mx-auto"></div>
                                <div className="mb-4 h-4 bg-gray-300 bg-opacity-10  w-3/4 mx-auto"></div>
                                <div className="h-6 bg-gray-300 bg-opacity-10  w-1/2 mx-auto"></div>
                            </div>

                            <div className="bg-white bg-opacity-[0.02] p-4 text-center animate-pulse">
                                <div className="h-4 bg-gray-300 bg-opacity-10  w-3/4 mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    const aimStation = searchParams.aimStation || 'your station';
    const widthPercentage = (timeLeft / trackingState.millisecondsTilRefresh) * 100
    const opacity = (1 - (timeLeft / trackingState.millisecondsTilRefresh)) * 0.4 + 0.1

    return (
        <div className="flex min-h-screen flex-col bg-[#111111] text-white">
            <main className="flex-1">
                <div className="container mx-auto px-4 py-6">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center mb-4">
                            <Train className="h-6 w-6" />
                        </div>
                        <h1 className="text-xl font-semibold">Track platform</h1>
                    </div>

                    <div className={`max-w-2xl mx-auto transition-opacity duration-500 `}>
                        <div className="bg-white bg-opacity-5  p-4 mb-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-2xl font-bold">{trackingState.scheduledDepartureTime}</div>
                                    <div className="text-lg text-gray-400">
                                        To {trackingState.destination.name}
                                        {/* {aimStation && <span className="text-sm ml-1">via {aimStation}</span>} */}
                                    </div>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                    <div className="text-sm text-gray-400">{trackingState.provider}</div>
                                    <div className={`text-xs font-medium px-2 py-1 rounded-full mt-3 ${getTimeKeepingStatusColor(trackingState.timeKeepingStatus)}`}>
                                        {trackingState.timeKeepingStatus}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`relative overflow-hidden  ${getColorFromStatus(trackingState.status)} mb-4`}>
                            <div
                                className={`absolute inset-0 transition-all duration-1000 ${getLighterColorFromStatus(trackingState.status)}`}
                                style={{
                                    opacity: opacity,
                                    width: `${widthPercentage}%`,
                                    left: `${50 - widthPercentage / 2}%`
                                }}
                            ></div>
                            <div className="relative z-10 p-8 text-center">
                                <div className="mb-6 text-sm font-medium uppercase tracking-wider flex items-center justify-center">
                                    Platform
                                    <span className="ml-2 text-xs bg-red-500 text-white px-1 rounded animate-pulse flex items-center">
                                        <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                                        LIVE
                                    </span>
                                </div>
                                <div className="mb-8 text-[120px] font-bold leading-none">
                                    {trackingState.platform.number}
                                </div>
                                <div className="mb-4 text-sm opacity-40">
                                    Checking again in {Math.ceil(timeLeft / 1000)}s
                                </div>
                                <div className="flex items-center justify-center gap-2 text-lg font-medium">
                                    {getGlyphFromStatus(trackingState.status)}
                                    <span>
                                        {trackingState.status === "Wait" && "Wait near platform..."}
                                        {trackingState.status === "Go" && "Go to platform now"}
                                        {trackingState.status === "Prepare" && "Get ready..."}
                                        {trackingState.status === "Unknown" && "Status unknown"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white bg-opacity-5  p-4 text-center text-sm font-normal">
                            {getDescriptionFromStatus(trackingState.status)}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}