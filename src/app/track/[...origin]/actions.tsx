

'use server'
import { z } from 'zod'
import { TrackStatusParamsSchema, TrackStatusResponse } from '@/schemas/trackStatus'
import { rateLimitByIp, rateLimitByKey } from '@/lib/limiter'
import { authenticatedAction, unauthenticatedAction } from '@/lib/safe-action'
import { checkCreditsCA, decrementCreditsCA } from '@/core-actions/core/utils/credits'
import { getTrackStateCA } from '@/core-actions/track-ca'

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

export const getTrackStateSA = unauthenticatedAction
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

    console.log("Calling getTrackStateCA with params:", input.input)
    const departureState = await getTrackStateCA(input.input)
    if (!departureState) {
      throw new Error("Couldn't retrieve the departure state.")
    }
    const newCredits = await decrementCreditsCA(input.input.userId);
    if (newCredits == null) {
      throw new Error('Failed to decrement credits.')
    }

    // Decrement credits after successfully fetching departure state

    console.log("[getDepartureStateSA] Departure state:", departureState)
    console.log("[getDepartureStateSA] Assigning remaining credits for user", input.input.userId, ":", newCredits)
    return { ...departureState, remainingCredits: newCredits } as TrackStatusResponse
  })