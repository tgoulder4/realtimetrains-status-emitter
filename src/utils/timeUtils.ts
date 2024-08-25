import { MILLISECONDS_BEFORE_POLLING_START, MIN_TIME_TIL_REFRESH, MINS_BEFORE_POLLING_START } from '@/lib/constants';
import { TrackState } from '@/lib/types';
export function convertDateToUTC(date: Date) { return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); }
export function getTimeInMsUntilStartPolling(depHours: number, depMins: number) {
    // console.log("depHours: ", depHours, "depMins: ", depMins)
    const depHoursInMs = depHours * 60 * 60 * 1000;
    const depMinsInMs = depMins * 60 * 1000;
    const now = convertDateToUTC(new Date())
    const nowHoursInMs = now.getHours() * 60 * 60 * 1000;
    const nowMinsInMs = now.getMinutes() * 60 * 1000;
    const timeUntilPollingStart = (depHoursInMs - nowHoursInMs) + (depMinsInMs - nowMinsInMs) - (MINS_BEFORE_POLLING_START * 60 * 1000);
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
            const timeTilStartPolling = getTimeInMsUntilStartPolling(Number(scheduledDepartureTime.slice(0, 2)), Number(scheduledDepartureTime.slice(2)))
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