import { findStationCodeByName, findStationNameByCode } from "@/lib/destinations";
export function dissectOneTrainInfoFromUrl(train: string) {
    const matches = {
        depTime: train.match(/T-(\d{4})/)?.[1],
        depDestinationStation: train.match(/D-(\w{3})/)?.[1],
        aimStationCode: train.match(/A-(\w{3})/)?.[1]
    };
    for (const key in matches) {
        if (key === null || key === "null") {
            throw new Error(`No match found for ${key}`);
        }
    }
    const service = {
        departure: { depDestinationStation: matches.depDestinationStation as string, depDestinationStationName: findStationNameByCode(matches.depDestinationStation!) as string },
        scheduledDepartureTime: matches.depTime!.slice(0, 2) + ":" + matches.depTime!.slice(2),
        aimStation: { code: matches.aimStationCode as string, name: findStationNameByCode(matches.aimStationCode!) }
    }
    return service;
}
export function dissectTrainInfoFromUrl(trains: string) {
    const services = trains.split('+').map((train) => dissectOneTrainInfoFromUrl(train));
    return services;
}