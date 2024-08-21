import { Service } from "@/lib/types";

export function getCheckingAgainText(status: Service['status'], timeRemaining: number, startTime: number) {
    if (startTime > 10000) {
        //add the time remaining to the current time then show the time in HH:MM
        //timeremaining is in ms. convert to minutes and hours then add to current time
        const d = new Date();
        d.setMilliseconds(d.getMilliseconds() + startTime);
        console.log("d.getHours(): ", d.getHours(), "d.getMinutes(): ", d.getMinutes())
        return `Checking again at ${d.getHours() < 10 ? "0" + d.getHours() : d.getHours()}:${d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()}`
    }
    else if (timeRemaining <= -5000) {
        return 'Still checking...'
    }
    else if ((timeRemaining < 0) && startTime > 0) {
        return 'Checking...'
    }
    else if ((startTime <= 10000)) {
        return `Checking again in ${timeRemaining / 1000}s`
    }
    else {
        return "Error"
    }
}