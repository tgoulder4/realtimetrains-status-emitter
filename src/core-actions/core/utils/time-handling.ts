import { MILLISECONDS_BEFORE_POLLING_START, MIN_TIME_TIL_REFRESH, MINS_BEFORE_POLLING_START } from '@/lib/constants';
import { TrackState } from '@/lib/types';
export function convertDateToUTC(date: Date) {
    const UTCDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    console.log("UTCDate: ", UTCDate.getHours() < 10 ? "0" + UTCDate.getHours() : UTCDate.getHours() + ":" + (UTCDate.getMinutes() < 10 ? "0" + UTCDate.getMinutes() : UTCDate.getMinutes()));
    return UTCDate
}
export function getTimeInMsUntilStartPolling(localDepHours: number, localDepMins: number) {
    console.log("getTimeInMsUntilStartPolling called with localDepHours: ", localDepHours, "localDepMins: ", localDepMins);
    var dd = new Date();
    dd.setHours(localDepHours);
    dd.setMinutes(localDepMins);
    const depDateUTC = convertDateToUTC(dd);
    const depDateUTCHours = depDateUTC.getHours();
    console.log("depDateUTCHours: ", depDateUTCHours);
    const depDateUTCMinutes = depDateUTC.getMinutes();
    console.log("depDateUTCMinutes: ", depDateUTCMinutes);

    const nowUTC = convertDateToUTC(new Date())
    const nowUTCHours = nowUTC.getHours();
    console.log("nowUTCHours: ", nowUTCHours);
    const nowUTCMinutes = nowUTC.getMinutes();
    console.log("nowUTCMinutes: ", nowUTCMinutes);
    const timeUntilPollingStart = ((depDateUTCHours * 60 * 60 * 1000) - nowUTCHours * 60 * 60 * 1000) + ((depDateUTCMinutes * 60 * 1000) - nowUTCMinutes * 60 * 1000) - (MINS_BEFORE_POLLING_START * 60 * 1000);
    // console.log("timeUntilPollingStart: ", timeUntilPollingStart);
    return timeUntilPollingStart;
}

/**
 * Parses a time string and converts it to a Date object
 * @param timeString - The time string to parse (format: "HH:MM")
 * @param referenceDate - The reference date to use
 * @returns A Date object representing the parsed time
 */
export function parseTime(timeString: string, referenceDate: Date): Date {
    console.log(`[parseTime] Parsing time: ${timeString}, Reference date: ${referenceDate}`);
    const [hours, minutes] = timeString.split(':').map(Number);
    console.log(`[parseTime] Parsed hours: ${hours}, minutes: ${minutes}`);
    const date = convertDateToUTC(new Date(referenceDate));
    date.setUTCHours(hours, minutes, 0, 0);
    console.log(`[parseTime] Initial parsed date: ${date}`);
    if (date < referenceDate) {
        date.setUTCDate(date.getUTCDate() + 1);
        console.log(`[parseTime] Date adjusted to next day: ${date}`);
    }
    console.log(`[parseTime] Final parsed date: ${date}`);
    return date;
}

export function getMillisecondsTilRefresh(status: TrackState['data']['status'], scheduledDepartureTime: string): number {
    switch (status) {
        case "Go":
            return MIN_TIME_TIL_REFRESH * 200000;
        case "Changed":
            return 30000;
        case "Error":
            return 20 ** 20;
        // case "Prepare":
        //     //date operations should only be client side.
        //     const depHours = Number(scheduledDepartureTime.slice(0, 2));
        //     const depMins = Number(scheduledDepartureTime.slice(2));
        //     //make a new date from dephours and depmins
        //     const dd = new Date();
        //     dd.setHours(depHours);
        //     dd.setMinutes(depMins);

        //     const timeTilStartPolling = getTimeInMsUntilStartPolling(dd.getHours(), dd.getMinutes());
        //     if (timeTilStartPolling < MILLISECONDS_BEFORE_POLLING_START) {
        //         console.log("timeTilStartPolling: ", timeTilStartPolling);
        //         throw new Error("TimeTilStartPolling is less than MILLISECONDS_TIL_POLLING_START while the status is prepare. This should not happen.")
        //     };
        //     return timeTilStartPolling;
        case "Wait":
            return 10000;
        default:
            return MIN_TIME_TIL_REFRESH;
    }
}