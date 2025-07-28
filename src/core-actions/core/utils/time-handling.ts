import { DEFAULT_POLLING_INTERVAL, MILLISECONDS_BEFORE_POLLING_START } from '@/lib/constants';
import { TrackState } from '@/lib/types';
import { DepartureState } from '@/schemas/states';
export function convertDateToUTC(date: Date) {
    const UTCDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
    console.log("UTCDate: ", UTCDate.getHours() < 10 ? "0" + UTCDate.getHours() : UTCDate.getHours() + ":" + (UTCDate.getMinutes() < 10 ? "0" + UTCDate.getMinutes() : UTCDate.getMinutes()));
    return UTCDate
}

/**
 * Parses a time string and converts it to a Date object
 * @param timeString - The time string to parse (format: "HHMM")
 * @param referenceDate - The reference date to use
 * @returns A Date object representing the parsed time
 */
export function parseTime(timeString: string, referenceDate: Date): Date {
    console.log(`[parseTime] Parsing time: ${timeString}, Reference date: ${referenceDate}`);

    const hours = parseInt(timeString.slice(0, 2), 10);
    const minutes = parseInt(timeString.slice(2), 10);

    console.log(`[parseTime] Parsed hours: ${hours}, minutes: ${minutes}`);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error(`Invalid time format: ${timeString}`);
    }

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

export function getMillisecondsTilRefresh(status: DepartureState['status'], msUntilDeparture: number): number {
    let millisecondsTilRefresh: number;
    if (status === 'Wait') {
        millisecondsTilRefresh = DEFAULT_POLLING_INTERVAL;
        console.log(`[useTrackState] Status is Wait, setting refresh interval to ${millisecondsTilRefresh}ms`);
    } else if (status === 'Prepare') {
        millisecondsTilRefresh = Math.max(msUntilDeparture - MILLISECONDS_BEFORE_POLLING_START, 1000);
        console.log(`[useTrackState] Status is Prepare, setting refresh interval to ${millisecondsTilRefresh}ms`);
    } else {
        millisecondsTilRefresh = DEFAULT_POLLING_INTERVAL;
        console.log(`[useTrackState] Status is ${status}, setting refresh interval to ${millisecondsTilRefresh}ms`);
    }
    return millisecondsTilRefresh;
}

export function getMsUntilDeparture(scheduledDepartureTime: string, referenceDate: Date): number {
    const scheduledDeparture = parseTime(scheduledDepartureTime, referenceDate);
    console.log(`[useTrackState] Scheduled departure: ${scheduledDeparture.toISOString()}`);
    const msUntilDeparture = scheduledDeparture.getTime() - referenceDate.getTime();
    console.log(`[useTrackState] Time until departure: ${msUntilDeparture}ms`);
    return msUntilDeparture;
}