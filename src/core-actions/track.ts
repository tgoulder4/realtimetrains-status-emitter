import { dissectOneTrainInfoFromUrl } from "@/app/track/dissectServicesToTrack";
import { TrackState } from "@/lib/types";
import { getServiceListCA } from "./main";

export async function getTrackStateCA(prevState: TrackState, journeyInCondensedURLformat: string) {
    console.log("dissecting journey info from url: ", journeyInCondensedURLformat);
    const journeyInfo = dissectOneTrainInfoFromUrl(journeyInCondensedURLformat);
    console.log("journeyInfo: ", journeyInfo);
    const serviceList = await getServiceListCA(journeyInfo.departure.depDestinationStation);
    console.log("serviceList: ", serviceList);
    const info = serviceList.find(service => (service.destination.code === journeyInfo.aimStation.code) && service.scheduledDepartureTime == journeyInfo.scheduledDepartureTime)!;
    const { status, platform } = info;
    const ts: TrackState = {
        data: {
            platform,

            status,
            platformHasChanged: prevState.data.platform !== "0" ? prevState.data.platform !== platform : false
        },
        hidden: {
            timeTillRefresh: 5000,
            error: undefined
        }
    }
    console.log("getTrackStateCA returning: ", ts);
    return ts;
}