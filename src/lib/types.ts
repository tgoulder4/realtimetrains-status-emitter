export type Service = {
    status: string,
    platform: string,
    departureTime: string,
    destinationStationName: string,
    stationCode: string,
    provider?: string
}
export type TrackState = {
    data: {
        status: string,
        platform: string,
        platformHasChanged?: boolean,
        minutesUntilDeparture?: number,
    }, hidden: {
        timeTillRefresh: number
    }
}