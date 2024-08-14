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
    function getTimeTilRefresh() {
        const depHours = parseInt(correspondingJourney!.scheduledDepartureTime.slice(0, 2));
        const depMins = parseInt(correspondingJourney!.scheduledDepartureTime.slice(2));
        var d = new Date();
        d.setHours(depHours, depMins - howManyMinutesPriorToDepartureToStartPolling, 0, 0);
        console.log("d.getHours(): ", d.getHours(), "d.getMinutes(): ", d.getMinutes());
        const diff = d.getTime() - Date.now();
        console.log("timeDifferenceInSeconds: ", diff);

        switch (correspondingJourney!.status) {
            case "Go":
                return 0;
            case "Wait":
                //start checking 20 mins before departure time in format HHMM
                return diff < 0 ? 10000 : diff;
            case "Changed":
                return 30000;
            case "Error":
                return 0;
            case "Wait":
                // console.log("nextCheckingTimeTwentyBeforeDep: ", nextCheckingTimeTwentyBeforeDep);
                return diff < 0 ? 10000 : diff;
            default:
                return 0;
        }
    }
    const timeTilRefresh = getTimeTilRefresh();
    console.log("getTimeTilRefresh returning: ", timeTilRefresh);
    const ts: TrackState = {
        data: correspondingJourney as Service,
        hidden: {
            timeTillRefresh: getTimeTilRefresh(),
            updateKey: Math.random().toString(36).substring(7),
            error: undefined
        }
    }
    // console.log("getTrackStateCA returning: ", ts);
    return ts;
}