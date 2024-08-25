import { findStationCodeByName, findStationNameByCode } from "@/lib/destinations";
import { Journey } from "@/lib/types";
export function dissectOneTrainInfoFromUrl(train: string): Journey {
    const matches = {
        depTime: train.match(/T-(\d{4})/)?.[1],
        code: train.match(/D-(\w{3})/)?.[1],
        aimStationCode: train.match(/A-(\w{3})/)?.[1]
    };
    for (const key in matches) {
        if (key === null || key === "null") {
            throw new Error(`No match found for ${key}`);
        }
    }
    const service = {
        departure: { code: matches.code as string, name: findStationNameByCode(matches.code!) as string, time: matches.depTime as string },
        aimStation: matches.aimStationCode ? { code: matches.aimStationCode as string, name: findStationNameByCode(matches.aimStationCode!) } : undefined
    }
    return service;
}
export function dissectTrainInfoFromUrl(trains: string) {
    const services = trains.split('+').map((train) => dissectOneTrainInfoFromUrl(train));
    return services;
}