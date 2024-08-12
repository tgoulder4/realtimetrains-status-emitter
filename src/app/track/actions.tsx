import { JourneySchema, TrackStateSchema } from "@/lib/schemas";
import { TrackState } from "@/lib/types";
import { unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { getServiceListCA } from "@/core-actions/main";
import { dissectOneTrainInfoFromUrl, dissectTrainInfoFromUrl } from "./dissectServicesToTrack";
import { getTrackStateCA } from "@/core-actions/track";

export const getTrackStateSA = unauthenticatedAction
    .createServerAction()
    .input(z.object({ journey: JourneySchema }))
    .handler(async ({ input }) => {
        console.log("getTrackState called with input: ", input)
        const ts = await getTrackStateCA(input.journey);
        console.log("getTrackState returning: ", ts);
        return ts as TrackState;
    })
