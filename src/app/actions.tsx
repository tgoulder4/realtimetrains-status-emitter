'use server'
import { stationNamesWithCodes } from "@/lib/map";
import { unauthenticatedAction } from "@/lib/safe-action";
import { redirect } from "next/navigation";
import { z } from "zod";
// export const submitDestinationSA = unauthenticatedAction
//     .createServerAction()
//     .input(z.object({ dest: z.string() }))
//     .handler(input => {
//         if (checkTru) {
//             redirect(`/pickTime?dest=${input.input.dest}`);
//         } else {
//             throw new Error('Invalid destination.');
//         }
//     })