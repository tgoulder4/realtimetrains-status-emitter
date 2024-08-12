import { getTrackStateCA } from '@/core-actions/track';
import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'
import { handle } from 'hono/vercel'
const app = new Hono().basePath('/api')
    //USE FOR TESTING ONLY
    .get('/admin/trackingState', async (c) => {
        console.log("api endpoint called")
        const ts = await getTrackStateCA({
            data: {
                status: "Prepare",
                platform: "0",
            },
            hidden: {
                timeTillRefresh: 0,
            }
        }, "T-1716D-BHMA-WFJ");
        return c.json(ts);
    })

export const GET = handle(app)
export const POST = handle(app)
export type AppType = typeof app;
//i want to periodically update the data in obj
//on 0 clients connected end the timer