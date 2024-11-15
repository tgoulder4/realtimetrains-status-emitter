

'use server'


// export const getTrackStateSA = unauthenticatedAction
//     .createServerAction()
//     .input(z.object({ journey: JourneySchema }))
//     .handler(async ({ input }) => {
//         // console.log("getTrackState called with input: ", input)
//         await rateLimitByKey({ key: "getTrackState", window: MIN_TIME_TIL_REFRESH - 1000, limit: 1 });
//         try {
//             const ts = await getTrackStateCA(input.journey);
//             return ts as TrackState;
//         } catch (e) {
//             console.log("getTrackState error: ", e);
//             redirect('/find?err=' + e);
//         }
//         // console.log("getTrackState returning: ", ts);
//     })

import { z } from 'zod'
import { TrackStatusParamsSchema } from '@/schemas/trackStatus'
import { checkCreditsCA, getDepartureStateCA, decrementCreditsCA } from '@/core-actions/track-status-ca'
import { rateLimitByIp, rateLimitByKey } from '@/lib/limiter'
import { authenticatedAction } from '@/lib/safe-action'

export const checkCreditsSA = authenticatedAction
  .createServerAction()
  .input(z.object({ userId: z.string() }))
  .handler(async (input) => {
    console.log("[checkCreditsSA] Checking credits for user", input.input.userId)
    await rateLimitByIp({ key: 'check-credits', limit: 10, window: 60000 })
    await rateLimitByKey({ key: 'check-credits', limit: 10, window: 60000 })
    const credits = await checkCreditsCA(input.input.userId)
    console.log("[checkCreditsSA] Credits for user", input.input.userId, ":", credits)
    return credits
  })

export const getDepartureStateSA = authenticatedAction
  .createServerAction()
  .input(
    TrackStatusParamsSchema.extend({
      userId: z.string()
    })
  )
  .handler(async (input) => {
    console.log("[getDepartureStateSA] Fetching departure state for params:", input.input)
    await rateLimitByIp({ key: 'get-departure-state', limit: 5, window: 30000 })
    await rateLimitByKey({ key: 'get-departure-state', limit: 5, window: 30000 })

    // Check credits before fetching departure state
    const credits = await checkCreditsCA(input.input.userId)
    if (credits <= 0) {
      throw new Error('Insufficient credits')
    }

    const departureState = await getDepartureStateCA(input.input)
    if (!departureState) {
      throw new Error('No departure state found')
    }

    // Decrement credits after successfully fetching departure state
    await decrementCreditsCA(input.input.userId)

    console.log("[getDepartureStateSA] Departure state:", departureState)
    return departureState
  })