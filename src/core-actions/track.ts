import { dissectOneTrainInfoFromUrl } from "@/app/track/dissectServicesToTrack";
import { Journey, Service, TrackState } from "@/lib/types";
import { getServiceListCA } from "./main";

export async function getTrackStateCA(journey: Journey): Promise<TrackState> {
    const {
        departure,
    } = journey
    const serviceList = await getServiceListCA(departure.code);
    // console.log("departure: ", departure, "serviceList: ", serviceList);
    const correspondingJourney = serviceList.find(service => (service.destination.code == departure.code && service.scheduledDepartureTime == departure.time));
    if (!correspondingJourney) throw new Error("Journey not found in RTT");
    function getTimeTilRefresh() {
        const depHours = parseInt(correspondingJourney!.scheduledDepartureTime.slice(0, 2));
        const depMins = parseInt(correspondingJourney!.scheduledDepartureTime.slice(2));
        var d = new Date();
        d.setHours(depHours, depMins - 20, 0, 0);
        console.log("d.getHours(): ", d.getHours(), "d.getMinutes(): ", d.getMinutes());
        const timeDifferenceInMilliseconds = d.getTime() - Date.now();
        console.log("timeDifferenceInSeconds: ", timeDifferenceInMilliseconds);
        switch (correspondingJourney!.status) {
            case "Go":
                return 0;
            case "Prepare":
                //start checking 20 mins before departure time in format HHMM
                return timeDifferenceInMilliseconds;
            case "Changed":
                return 30000;
            case "Error":
                return 0;
            case "Wait":
                // console.log("nextCheckingTimeTwentyBeforeDep: ", nextCheckingTimeTwentyBeforeDep);
                return timeDifferenceInMilliseconds;
            default:
                return 0;
        }
    }
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