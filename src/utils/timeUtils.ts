import { MILLISECONDS_BEFORE_POLLING_START, MIN_TIME_TIL_REFRESH, MINS_BEFORE_POLLING_START } from '@/lib/constants';
import { TrackState } from '@/lib/types';
export function convertDateToUTC(date: Date) {
    const UTCDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    console.log("UTCDate: ", UTCDate.getHours() < 10 ? "0" + UTCDate.getHours() : UTCDate.getHours() + ":" + (UTCDate.getMinutes() < 10 ? "0" + UTCDate.getMinutes() : UTCDate.getMinutes()));
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}
export function getTimeInMsUntilStartPolling(localDepHours: number, localDepMins: number) {
    // console.log("localDepHours: ", localDepHours, "localDepMins: ", localDepMins)
    var dd = new Date();
    dd.setHours(localDepHours);
    dd.setMinutes(localDepMins);
    const depDateUTC = convertDateToUTC(dd);

    const now = convertDateToUTC(new Date())
    const nowHoursInMs = now.getHours() * 60 * 60 * 1000;
    const nowMinsInMs = now.getMinutes() * 60 * 1000;
    const timeUntilPollingStart = ((depDateUTC.getHours() * 60 * 60 * 1000) - nowHoursInMs) + ((depDateUTC.getMinutes() * 60 * 1000) - nowMinsInMs) - (MINS_BEFORE_POLLING_START * 60 * 1000);
    // console.log("timeUntilPollingStart: ", timeUntilPollingStart);
    return timeUntilPollingStart;
}

export function getMillisecondsTilRefresh(status: TrackState['data']['status'], scheduledDepartureTime: string): number {
    switch (status) {
        case "Go":
            return 20 ** 20;
        case "Changed":
            return 30000;
        case "Error":
            return 20 ** 20;
        case "Prepare":
            const depHours = Number(scheduledDepartureTime.slice(0, 2));
            const depMins = Number(scheduledDepartureTime.slice(2));
            //make a new date from dephours and depmins
            const dd = new Date();
            dd.setHours(depHours);
            dd.setMinutes(depMins);
            const depDateUTC = convertDateToUTC(dd);

            const timeTilStartPolling = getTimeInMsUntilStartPolling(depDateUTC.getHours(), depDateUTC.getMinutes());
            if (timeTilStartPolling < MILLISECONDS_BEFORE_POLLING_START) {
                console.log("timeTilStartPolling: ", timeTilStartPolling);
                throw new Error("TimeTilStartPolling is less than MILLISECONDS_TIL_POLLING_START while the status is prepare. This should not happen.")
            };
            return timeTilStartPolling;
        case "Wait":
            return 10000;
        default:
            return 20 ** 20;
    }
}