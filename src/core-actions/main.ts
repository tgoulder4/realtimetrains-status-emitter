'use server'
import { cache } from "react";
import cheerio from 'cheerio'
import { Service } from "@/lib/types";
import { findStationCodeByName } from "../lib/destinations";
function checkIfClassInPlatformSpan($: cheerio.Root, service: cheerio.Element, str: string) {
    return $(service).find(".platform span").attr("class")?.includes(str)
}
export const getServiceListCA = async (dest?: string): Promise<Service[]> => {
    console.log("getServiceListCA called with dest: ", dest)
    try {
        const url = false ? `https://www.realtimetrains.co.uk/search/simple/gb-nr:EUS${dest ? `/to/gb-nr:${dest}` : ''}` : "http://localhost:3002/tests/departuresNoAim";
        console.log("url used: ", url)
        const res = await fetch(url, {
            headers: {
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
            // mode: 'no-cors',
        });
        console.log("res: ", res)
        const html = await res.text();
        const $ = cheerio.load(html);
        const list = $(".service").map((i, service) => {
            //expected platofrms have a class of ex. confirmedAndChanged platforms have a class of c, confirmedAndUnchanged have a class of a
            //platform numbers are found in .platform span
            let status;
            let platformType;
            if (checkIfClassInPlatformSpan($, service, "a")) {
                platformType = "confirmedAndNotChanged"
                status = "Go"
            }
            if (checkIfClassInPlatformSpan($, service, "c")) {
                status = "Go",
                    platformType = "confirmedAndChanged"
            } else if (checkIfClassInPlatformSpan($, service, "ex")) {
                status = "Wait",
                    platformType = "expected"
            }
            const platform = {
                number: $(service).find(".platform").text(),
                type: platformType
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
            //scheduledDepartureTime is in format HHMM so we need to insert a colon in the middle
            const scheduledDepartureTime = $(service).find(".time").text();
            // .replace(/(\d{2})(\d{2})/, "$1:$2");

            //provider is in format <div class="secline">Avanti WC Pendolino · 9 coaches</div>, we need "Avanti WC Pendolino"
            const provider = $(service).find(".secline").text().split("·")[0].trim();

            return { status, platform, scheduledDepartureTime, destination, provider } as Service;
        }).get();
        console.log("list returned: ", list)
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
