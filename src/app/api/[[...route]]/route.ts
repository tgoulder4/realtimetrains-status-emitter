import { Hono } from 'hono'
import { rateLimiter } from 'hono-rate-limiter'
import { handle } from 'hono/vercel'
import departures from './departures'
import credits from './credits'
import coreActions from './testing-core-actions'
import { lucia, validateRequest } from '@/lib/auth'
import { env } from '@/env'
import { getCurrentUser } from '@/lib/session'

const auth = lucia;

const app = new Hono().basePath('/api')

// Middleware to validate session
const validateSession = async (c: any, next: () => Promise<void>) => {
  try {
    const { user, session } = await validateRequest()
    if (!user || !session) {
      if (
        env.NODE_ENV === 'production'
        // true
      ) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
    }
    c.set('user', user)
    c.set('session', session)
    await next()
  } catch (error) {
    console.error('Error validating session:', error)
    return c.json({ error: 'Invalid session' }, 401)
  }
}
// app.use('*', validateSession)
const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  message: 'Too many requests, please try again later.',
  standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  keyGenerator: (c) => "<unique_key>", // Method to generate custom identifiers for clients.
})
app.route("/departures", departures)
app.route("/test", coreActions)

// Apply rate limiting to all routes
app.use(limiter)
app.route('/credits', credits)

export const GET = handle(app)
export const POST = handle(app)