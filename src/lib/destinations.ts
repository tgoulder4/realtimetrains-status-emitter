import { stationNamesWithCodes } from "./map";

export function checkTrueStationName(destination: string) {
    return stationNamesWithCodes.find(station => station.StationName === destination) ? true : false
}
export const findStationCodeByName = (stationName: string) => {
    const station = stationNamesWithCodes.find(station => station.StationName === stationName) || { Code: "" };
    return station.Code || null;
}
export const findStationNameByCode = (destinationStationCode: string) => {
    const station = stationNamesWithCodes.find(station => station.Code === destinationStationCode) || { StationName: "" };
    return station.StationName
}