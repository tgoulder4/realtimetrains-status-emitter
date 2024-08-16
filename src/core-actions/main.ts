'use server'
import { cache } from "react";
import cheerio from 'cheerio'
import { Service } from "@/lib/types";
import { findStationCodeByName } from "../lib/destinations";
import { env } from "@/env";
import { howManyMinutesPriorToDepartureToStartPolling } from "@/lib/constants";
function checkIfClassInPlatformSpan($: cheerio.Root, service: cheerio.Element, str: string) {
    return $(service).find(".platform span").attr("class")?.includes(str)
}
export const getServiceListCA = async (dest?: string): Promise<Service[]> => {
    console.log("getServiceListCA called with dest: ", dest)
    try {
        let res: Response;
        if (env.NODE_ENV === 'production') {
            console.log("fetching from localhost")
            res = await fetch("http://localhost:3000/tests/departuresNoAim",
                {
                    headers: {
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                    },
                }
            )
        } else {
            //fetch via proxy to rtt
            res = await fetch('https://proxy.scrapeops.io/v1/?' + new URLSearchParams({
                api_key: env.SCRAPEOPS_API_KEY,
                url: `https://www.realtimetrains.co.uk/search/simple/gb-nr:EUS${dest ? `/to/gb-nr:${dest}` : ''}`
            }))
        }
        if (!res.ok) throw new Error("Failed to fetch data. Code RES_NOT_OK")
        console.log("res: ", res)
        const html = await res.text();
        const $ = cheerio.load(html);
        let status: Service["status"];
        let platformType: Service['platform']['type'];
        const list = $(".service").map((i, service) => {
            const platform = {
                number: $(service).find(".platform").text(),
                type: ""
            }
            const destinationStationName = $(service).find('.location')
                .clone() // Clone the element to ensure the original HTML is not modified
                .children('.addl').remove().end() // Remove the children with class 'addl'
                .text() // Extract the text content
                .trim(); // Trim any extra whitespace
            const destination = {
                name: destinationStationName,
                code: findStationCodeByName(destinationStationName)
            }
            const scheduledDepartureTime = $(service).find(".time").text();
            const provider = $(service).find(".secline").text().split("·")[0].trim().replace(" service", "");
            let status: Service["status"];
            let platformType: Service['platform']['type'];
            if (checkIfClassInPlatformSpan($, service, "a") && !checkIfClassInPlatformSpan($, service, "c")) {
                platformType = "confirmedAndNotChanged"
                status = "Go"
            }
            else if (checkIfClassInPlatformSpan($, service, "c") && checkIfClassInPlatformSpan($, service, "a")) {
                status = "Go",
                    platformType = "confirmedAndChanged"
            } else if (checkIfClassInPlatformSpan($, service, "ex")) {
                status = "Prepare"
                platformType = "expected"
            } else {
                status = 'Error'
                platformType = 'expected'
            }

            return { status, platform, scheduledDepartureTime, destination, provider } as Service;
        }).get();
        // console.log("list returned: ", list)
        return list;

    } catch (e) {
        console.error(e);
        return [{
            status: 'Error', platform: {
                number: '--', type: 'confirmedAndChanged'
            }, provider: "Avanti", scheduledDepartureTime: '--', destination: { name: '', code: '' }
        }]
    }
}
