'use server'
import cheerio from 'cheerio'
import { Service } from "@/lib/types";
import { env } from "@/env";
import { extractServiceDetailsFromServiceElementCA } from "./extract-service-details";

/**
 * 
 * @param dest The destination code of the station. If not provided, the function will return the services to all destinations.
 * @returns A list of service objects of type Service.
 */
export const getServiceListCA = async (dest?: string): Promise<Service[]> => {
    console.log("getServiceListCA called with dest: ", dest)
    try {
        let res: Response;
        let url: any;
        if (env.NODE_ENV === "production") { //DO NOT CHANGE THIS LINE
            url = 'https://proxy.scrapeops.io/v1/?' + new URLSearchParams({
                api_key: env.SCRAPEOPS_API_KEY,
                url: `https://www.realtimetrains.co.uk/search/simple/gb-nr:EUS${dest ? `/to/gb-nr:${dest}` : ''}`
            })
        } else {
            url =
                `https://www.realtimetrains.co.uk/search/simple/gb-nr:EUS${dest ? `/to/gb-nr:${dest}` : ''}`
            // for testing: 
            // 'http://localhost:3000/tests/departuresNoAim'
        }
        console.log("fetching from url: ", url)
        res = await fetch(url)

        if (!res.ok) throw new Error("Failed to fetch data. Code RES_NOT_OK")
        // console.log("res: ", res)
        const html = await res.text();
        // console.log("html: ", html)
        const $ = cheerio.load(html);
        const list = $(".service").map((i, service) => extractServiceDetailsFromServiceElementCA($, service)).get();
        // console.log("list returned: ", list)
        return list;

    } catch (e) {
        console.error(e);
        return [{
            status: 'Error', platform: {
                number: '--',
            }, provider: "Avanti", scheduledDepartureTime: '--', destination: { name: '', code: '' }
        }]
    }
}
