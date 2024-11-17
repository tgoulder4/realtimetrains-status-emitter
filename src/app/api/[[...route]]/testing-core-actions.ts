import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { TrackStatusParamsSchema } from '../../../schemas/trackStatus'
import { addCreditsCA, checkCreditsCA, decrementCreditsCA, getDepartureStateCA } from '@/core-actions/core/track'
import { lucia } from '@/lib/auth'
import { env } from '@/env'


const app = new Hono()

  .post('/check-credits', zValidator('json', z.object({ userId: z.string() })), async (c) => {
    const { userId } = c.req.valid('json')
    const credits = await checkCreditsCA(userId)
    return c.json({ credits })
  })

  .post('/get-departure-state', zValidator('json', TrackStatusParamsSchema), async (c) => {
    const params = c.req.valid('json')
    const departureState = await getDepartureStateCA(params)
    if (!departureState) {
      return c.json({ error: 'No matching service found' }, 404)
    }
    return c.json(departureState)
  })

  .post('/decrement-credits', zValidator('json', z.object({ userId: z.string() })), async (c) => {
    const { userId } = c.req.valid('json')
    const newCredits = await decrementCreditsCA(userId)
    return c.json({ credits: newCredits })
  })


  .post('/add-credits', zValidator('json', z.object({ userId: z.string(), amount: z.number().positive() })), async (c) => {
    const { userId, amount } = c.req.valid('json')
    try {
      const newCredits = await addCreditsCA(userId, amount)
      return c.json({ credits: newCredits })
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 400)
      }
      return c.json({ error: 'An unexpected error occurred' }, 500)
    }
  })

export default app