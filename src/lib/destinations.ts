import { stationNamesWithCodes } from "./map";

export function checkTrueDestinationName(destination: string) {
    return stationNamesWithCodes.find(station => station.StationName === destination) ? true : false
}