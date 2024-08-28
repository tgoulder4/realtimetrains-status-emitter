import { Service } from "@/lib/types";
import { convertDateToUTC } from "./timeUtils";
import { MIN_TIME_TIL_REFRESH } from "@/lib/constants";

/**
 * 
 * @param status 
 * @param timeRemaining 
 * @param timeWhenPollingStarts HHMM
 * @returns The text to display in the status card e.g. "Checking again in 5s"
 */
export function getCheckingAgainText(timeRemaining: number, msTilRefresh: number, status: Service['status']): string {
    console.log("getCheckingAgainText called with timeRemaining: ", timeRemaining, " msTilRefresh: ", msTilRefresh, " status: ", status)
    if (status == "Prepare") {
        if (msTilRefresh <= 120000) {
            return `Checking again in ${timeRemaining / 1000}s`
        }
        var d = new Date();
        //add the ms til refresh to the current time
        d.setMilliseconds(d.getMilliseconds() + timeRemaining);
        console.log("getminutes: ", d.getMinutes(), " gethours: ", d.getHours())
        return `Checking again at ${d.getHours() < 10 ? `0${d.getHours()}` : d.getHours()}:${d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes()}`
    }
    else if (timeRemaining <= -5000 && status == "Wait") {
        return 'Still checking...'
    }
    else if ((timeRemaining <= 0) && msTilRefresh > 0 && status == "Wait") {
        return 'Checking...'
    }
    else if ((status == "Wait") && timeRemaining > 0) {
        return `Checking again in ${timeRemaining / 1000}s`
    }
    else {
        return "Error"
    }
}