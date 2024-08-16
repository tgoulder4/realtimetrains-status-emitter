'use server'
import { dissectOneTrainInfoFromUrl } from "@/app/track/dissectServicesToTrack";
import { Journey, Service, TrackState } from "@/lib/types";
import { getServiceListCA } from "./main";
import { howManyMinutesPriorToDepartureToStartPolling } from "@/lib/constants";

export async function getTrackStateCA(journey: Journey): Promise<TrackState> {
    const {
        departure,
    } = journey
    const serviceList = await getServiceListCA(departure.code);
    console.log("departure: ", departure, "serviceList: ", serviceList);
    const correspondingJourney = serviceList.find(service => (service.destination.code == departure.code && service.scheduledDepartureTime == departure.time));
    if (!correspondingJourney) throw new Error("We couldn't find the journey.");
    function getMillisecondsTilRefresh() {
        const depHours = parseInt(correspondingJourney!.scheduledDepartureTime.slice(0, 2));
        const depHoursInMs = depHours * 60 * 60 * 1000;
        console.log("depHours: ", depHours);
        const depMins = parseInt(correspondingJourney!.scheduledDepartureTime.slice(2));
        const depMinsInMs = depMins * 60 * 1000;
        console.log("depMins: ", depMins);
        //get time now, with hours and minutes in milliseconds
        const now = new Date();
        const nowHours = now.getHours();
        console.log("nowHours: ", nowHours);
        const nowMins = now.getMinutes();
        console.log("nowMins: ", nowMins);

        //subtract the current time from the departure time
        const millisecondsUntilStartPolling = (depHoursInMs + depMinsInMs) - ((nowHours * 60 * 60 * 1000) + (nowMins * 60 * 1000) + (howManyMinutesPriorToDepartureToStartPolling * 60 * 1000));
        console.log("diff: ", millisecondsUntilStartPolling);


        switch (correspondingJourney!.status) {
            case "Go":
                return 0;
            case "Changed":
                return 30000;
            case "Error":
                return 0;
            case "Wait":
                // console.log("nextCheckingTimeTwentyBeforeDep: ", nextCheckingTimeTwentyBeforeDep);

                //this diff calculation is returning positive in production, but negative in dev. I don't know why.
                // return diff < 0 ? 10000 : diff;
                return millisecondsUntilStartPolling < 0 ? 10000 : millisecondsUntilStartPolling;
            default:
                return 0;
        }
    }
    const timeTilRefresh = getMillisecondsTilRefresh();
    console.log("getMillisecondsTilRefresh returning: ", timeTilRefresh);
    const ts: TrackState = {
        data: correspondingJourney as Service,
        hidden: {
            timeTillRefresh: getMillisecondsTilRefresh(),
            updateKey: Math.random().toString(36).substring(7),
            error: undefined
        }
    }
    // console.log("getTrackStateCA returning: ", ts);
    return ts;
}