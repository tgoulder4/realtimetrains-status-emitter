import { MILLISECONDS_BEFORE_POLLING_START } from "@/lib/constants";
import { convertDateToUTC, parseTime } from "../utils/time-handling";
import { DepartureState } from "@/schemas/states";

/**
 * Determines the status of a train service based on platform class and time
 * @param $service - Cheerio object representing a train service
 * @returns The status of the train service or null if undetermined
 */
export function getStatus($service: cheerio.Cheerio): DepartureState['status'] | null {
    console.log(`[getStatus] Analyzing service: ${$service.find('.location.d span').text().trim()}`);
    const platform = $service.find('.platform');
    console.log(`[getStatus] Platform class: ${platform.attr('class')}`);

    // Check if the platform has class 'ex' (expected)
    if (platform.hasClass('ex')) {
        const scheduledTime = $service.find('.time.plan.d').text().trim();
        console.log(`[getStatus] Scheduled time: ${scheduledTime}`);
        const currentTime = convertDateToUTC(new Date());
        console.log(`[getStatus] Current time (UTC): ${currentTime}`);
        const scheduledDate = parseTime(scheduledTime, currentTime);
        console.log(`[getStatus] Scheduled date (UTC): ${scheduledDate}`);
        const timeDiff = scheduledDate.getTime() - currentTime.getTime();
        console.log(`[getStatus] Time difference: ${timeDiff} ms`);
        const status = timeDiff > MILLISECONDS_BEFORE_POLLING_START ? 'Prepare' : 'Wait';
        console.log(`[getStatus] Determined status: ${status}`);
        return status;
    } else if (platform.hasClass('a') || platform.hasClass('c')) {
        // 'a' for arrived, 'c' for changed
        console.log(`[getStatus] Platform is active or changed, status: Go`);
        return 'Go';
    } else {
        console.log(`[getStatus] Unable to determine status, returning null`);
        return 'Unknown'
    }
}