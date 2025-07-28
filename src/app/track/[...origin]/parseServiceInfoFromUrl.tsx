import { findStationCodeByName, findStationNameByCode } from "@/lib/destinations";

export function getTimeDestAimInfoFromUrl(trains: string) {
    return trains.split('+').map((train) => {
        return getTimeDestAimInfoFromTrainToTrack(train);
    });
}
function getTimeDestAimInfoFromTrainToTrack(train: string) {
    //get time
    const depTime = train.slice(1, 5);
    console.log("depTime: ", depTime)
    //get destination code up to char before A
    const stationCode = train.slice(6, -4)
    console.log("stationCode: ", stationCode)
    const stationName = findStationNameByCode(stationCode);
    //get aim station
    const aimStation = train.slice(-3)
    console.log("aimStation: ", aimStation)
    const aimStationName = findStationNameByCode(aimStation);
    return {
        scheduledDepartureTime:
            //insert a  : in the middle of the string
            depTime.slice(0, 2) + ":" + depTime.slice(2)
        , departure: { stationCode, stationName }, aimStation: { code: aimStation, name: aimStationName }
    }
}
export type TParsedTrainInfo = ReturnType<typeof getTimeDestAimInfoFromTrainToTrack>
export type TGetTimeDestAimInfoFromUrl = ReturnType<typeof getTimeDestAimInfoFromUrl>