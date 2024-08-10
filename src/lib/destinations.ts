import { stationNamesWithCodes } from "./map";

export function checkTrueDestinationName(destination: string) {
    return stationNamesWithCodes.find(station => station.StationName === destination) ? true : false
}
export const findDestinationCodeByName = (stationName: string) => {
    const station = stationNamesWithCodes.find(station => station.StationName === stationName) || { Code: "" };
    return station.Code
}
export const findDestinationNameByCode = (stationCode: string) => {
    const station = stationNamesWithCodes.find(station => station.Code === stationCode) || { StationName: "" };
    return station.StationName
}