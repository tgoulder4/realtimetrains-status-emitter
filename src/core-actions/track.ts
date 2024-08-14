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
        switch (correspondingJourney!.status) {
            case "Go":
                return 0;
            case "Prepare":
                return 30000;
            case "Changed":
                return 30000;
            case "Error":
                return 0;
            case "Wait":
                return 10000;
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