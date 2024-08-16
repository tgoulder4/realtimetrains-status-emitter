'use server'
import { JourneySchema, TrackStateSchema } from "@/lib/schemas";
import { TrackState } from "@/lib/types";
import { unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { getServiceListCA } from "@/core-actions/main";
import { dissectOneTrainInfoFromUrl, dissectTrainInfoFromUrl } from "./dissectServicesToTrack";
import { getTrackStateCA } from "@/core-actions/track";
import { rateLimitByKey } from "@/lib/limiter";
import { redirect } from "next/navigation";

export const getTrackStateSA = unauthenticatedAction
    .createServerAction()
    .input(z.object({ journey: JourneySchema }))
    .handler(async ({ input }) => {
        // console.log("getTrackState called with input: ", input)
        await rateLimitByKey({ key: "getTrackState", window: 10000, limit: 10 });
        const ts = await getTrackStateCA(input.journey);
        if (ts.hidden.error) redirect('/find?err=' + ts.hidden.error);
        // console.log("getTrackState returning: ", ts);
        return ts as TrackState;
    })
