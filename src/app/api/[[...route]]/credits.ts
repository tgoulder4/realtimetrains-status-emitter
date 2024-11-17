
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { checkCreditsCA } from '@/core-actions/core/track'
import { Hono } from 'hono'

const app = new Hono()

app.get('/:userId', zValidator('param', z.object({ userId: z.string() })), async (c) => {
  const { userId } = c.req.valid('param')
  console.log(`[API] Checking credits for user: ${userId}`)

  try {
    const credits = await checkCreditsCA(userId)
    console.log(`[API] Credits for user ${userId}: ${credits}`)
    return c.json({ credits })
  } catch (error) {
    console.error(`[API] Error checking credits for user ${userId}:`, error)
    return c.json({ error: 'Failed to check credits' }, 500)
  }
})

export default app