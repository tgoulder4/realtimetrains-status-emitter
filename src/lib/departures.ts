import { Service } from "./types";

/**
 * 
 * @param srvcs 
 * @returns Unique services. Returns array value of "MULTIDEST" for multiple destinations.
 */
export function findUniquelyNamedDepartures(srvcs: Service[]): Service[] {
    return srvcs.map(station => {
        const stationName = station.destination.name;
        //if stationanme contains a comma or an and symbol throw an error
        if (stationName.includes(',') || stationName.includes('&')) {
            return { destination: { name: "MULTIDEST", code: '' }, scheduledDepartureTime: "--", platform: "0", status: "Error" };
        } else {
            return station
        }
    }).filter((value, index, self) => {
        return srvcs.findIndex(station => station.destination.name === value.destination.name) === index;
    })
}