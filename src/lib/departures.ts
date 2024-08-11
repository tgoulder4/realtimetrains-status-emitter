import { Service } from "./types";

/**
 * 
 * @param srvcs 
 * @returns Unique services. Returns array value of "MULTIDEST" for multiple destinations.
 */
export function findUniquelyNamedDepartures(srvcs: Service[]): Service[] {
    return srvcs.map(station => {
        const stationName = station.destinationStationName;
        //if stationanme contains a comma or an and symbol throw an error
        if (stationName.includes(',') || stationName.includes('&')) {
            return { destinationStationName: "MULTIDEST", scheduledDepartureTime: "--", platform: "0", status: "Error", destinationStationCode: "--" };
        } else {
            return station
        }
    }).filter((value, index, self) => {
        return srvcs.findIndex(station => station.destinationStationName === value.destinationStationName) === index;
    })
}