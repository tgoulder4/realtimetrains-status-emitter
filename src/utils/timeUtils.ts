import { MILLISECONDS_BEFORE_POLLING_START, MIN_TIME_TIL_REFRESH, MINS_BEFORE_POLLING_START } from '@/lib/constants';
import { TrackState } from '@/lib/types';

export function getTimeInMsUntilStartPolling(depHours: number, depMins: number) {
    const depHoursInMs = depHours * 60 * 60 * 1000;
    const depMinsInMs = depMins * 60 * 1000;
    const now = new Date();
    const nowHours = now.getHours();
    const nowMins = now.getMinutes();
    const timeUntilPollingStart = (depHoursInMs + depMinsInMs) - ((nowHours * 60 * 60 * 1000) + (nowMins * 60 * 1000) + (MINS_BEFORE_POLLING_START * 60 * 1000));
    console.log("timeUntilPollingStart: ", timeUntilPollingStart);
    return timeUntilPollingStart;
}

export function getMillisecondsTilRefresh(status: TrackState['data']['status'], scheduledDepartureTime: string): number {
    switch (status) {
        case "Go":
            return Number(Infinity);
        case "Changed":
            return 30000;
        case "Error":
            return Number(Infinity);
        case "Prepare":
            const timeTilStartPolling = getTimeInMsUntilStartPolling(Number(scheduledDepartureTime.slice(0, 2)), Number(scheduledDepartureTime.slice(2)))
            if (timeTilStartPolling < MILLISECONDS_BEFORE_POLLING_START) throw new Error("TimeTilStartPolling is less than MILLISECONDS_TIL_POLLING_START while the status is prepare. This should not happen.");
            return timeTilStartPolling;
        case "Wait":
            return 10000;
        default:
            return Number(Infinity);
    }
}