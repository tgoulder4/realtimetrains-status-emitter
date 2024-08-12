import { dissectOneTrainInfoFromUrl } from "@/app/track/dissectServicesToTrack";
import { TrackState } from "@/lib/types";
import { getServiceListCA } from "./main";

export async function getTrackStateCA(journeyInCondensedURLformat: string) {
    console.log("dissecting journey info from url: ", journeyInCondensedURLformat);
    const journeyInfo = dissectOneTrainInfoFromUrl(journeyInCondensedURLformat);
    console.log("journeyInfo: ", journeyInfo);
    const serviceList = await getServiceListCA(journeyInfo.departure.depDestinationStation);
    console.log("serviceList: ", serviceList);
    const info = serviceList.find(service => (service.destination.code === journeyInfo.aimStation.code) && service.scheduledDepartureTime == journeyInfo.scheduledDepartureTime)!;
    const ts: TrackState = {
        data: info,
        hidden: {
            timeTillRefresh: 5000,
            error: undefined
        }
    }
    console.log("getTrackStateCA returning: ", ts);
    return ts;
}