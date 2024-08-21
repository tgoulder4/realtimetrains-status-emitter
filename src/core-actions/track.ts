
import { Journey, Service, TrackState } from "@/lib/types";
import { getServiceListCA } from "./main";
import { getMillisecondsTilRefresh } from "@/utils/timeUtils";
export async function getTrackStateCA(journey: Journey): Promise<TrackState> {
    const {
        departure,
    } = journey
    const serviceList = await getServiceListCA(departure.code);
    console.log("departure: ", departure, "serviceList: ", serviceList);
    const correspondingJourney = serviceList.find(service => (service.destination.code == departure.code && service.scheduledDepartureTime == departure.time));
    if (!correspondingJourney || !correspondingJourney.scheduledDepartureTime) throw new Error("We couldn't find the journey.");

    const timeTilRefresh = getMillisecondsTilRefresh(correspondingJourney!.status, correspondingJourney!.scheduledDepartureTime);
    console.log("timeTilRefresh: ", timeTilRefresh);
    const updateKey = Math.random().toString(36).substring(7);
    console.log("getMillisecondsTilRefresh returning: ", timeTilRefresh);
    const ts: TrackState = {
        data: correspondingJourney as Service,
        hidden: {
            timeTilRefresh,
            updateKey
        }
    }
    return ts;
}