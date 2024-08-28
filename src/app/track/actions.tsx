'use server'
import { JourneySchema, TrackStateSchema } from "@/lib/schemas";
import { TrackState } from "@/lib/types";
import { unauthenticatedAction } from "@/lib/safe-action";
import { z } from "zod";
import { dissectOneTrainInfoFromUrl, dissectTrainInfoFromUrl } from "./get-station-details-from-station-code";
import { getTrackStateCA } from "@/core-actions/track";
import { rateLimitByKey } from "@/lib/limiter";
import { redirect } from "next/navigation";
import { MIN_TIME_TIL_REFRESH } from "@/lib/constants";

export const getTrackStateSA = unauthenticatedAction
    .createServerAction()
    .input(z.object({ journey: JourneySchema }))
    .handler(async ({ input }) => {
        // console.log("getTrackState called with input: ", input)
        await rateLimitByKey({ key: "getTrackState", window: MIN_TIME_TIL_REFRESH - 1000, limit: 1 });
        try {
            const ts = await getTrackStateCA(input.journey);
            return ts as TrackState;
        } catch (e) {
            console.log("getTrackState error: ", e);
            redirect('/find?err=' + e);
        }
        // console.log("getTrackState returning: ", ts);
    })
