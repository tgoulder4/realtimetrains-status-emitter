// import { findStationCodeByName } from "@/lib/destinations";
// import { Service } from "@/lib/types";
// function checkIfPlatformHasClass($: cheerio.Root, service: cheerio.Element, className: string) {
//     return $(service).find(".platform span").attr("class")?.includes(className)
// }
// export function extractServiceDetailsFromServiceElementCA($: cheerio.Root, service: cheerio.Element) {
//     const platform = {
//         number: $(service).find(".platform").text(),
//     }
//     const destinationStationName = $(service).find('.location')
//         .clone() // Clone the element to ensure the original HTML is not modified
//         .children('.addl').remove().end() // Remove the children with class 'addl'
//         .text() // Extract the text content
//         .trim(); // Trim any extra whitespace
//     const destination = {
//         name: destinationStationName,
//         code: findStationCodeByName(destinationStationName)
//     }
//     const scheduledDepartureTime = $(service).find(".time").text();
//     console.log("scheduledDepartureTime: ", scheduledDepartureTime);
//     const provider = $(service).find(".secline").text().split("·")[0].trim().replace(" service", "");
//     let status: Service["status"];
//     if (checkIfPlatformHasClass($, service, "a") && !checkIfPlatformHasClass($, service, "c")) {
//         status = "Go"
//     }
//     else if (checkIfPlatformHasClass($, service, "c") && checkIfPlatformHasClass($, service, "a")) {
//         status = "Go"
//     }
//     else if (checkIfPlatformHasClass($, service, "ex")) {
//         // do time operations only on client side.
//         const getTimeUntilStartPolling = getTimeInMsUntilStartPolling(depHours, depMins);
//         if (getTimeUntilStartPolling > 0) {
//             console.log("getTimeUntilStartPolling: ", getTimeUntilStartPolling, " was greater than 0. Setting status to Prepare");
//             status = "Prepare"
//         } else {
//             console.log("getTimeUntilStartPolling: ", getTimeUntilStartPolling, " was less than 0. Setting status to Wait.");
//             status = 'Wait'
//         }
//         status = 'Prepare'
//     }
//     else {
//         status = 'Error'
//     }

//     return { status, platform, scheduledDepartureTime, destination, provider } as Service;
// }