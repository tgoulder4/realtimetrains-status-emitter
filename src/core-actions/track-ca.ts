'use server'
import { DepartureState } from "@/schemas/states";
import { TrackStatusParams, TrackStatusResponse } from "@/schemas/trackStatus";
import { fetchServiceList } from "./core/utils/fetch-service-list";
import { getDepartureState } from "./core/main";
import cheerio from 'cheerio';

//for /track
export async function getTrackStateCA(params: TrackStatusParams): Promise<DepartureState | null> {
    console.log(`[getTrackState] Fetching departure state for params:`, params)
    const {
        departureId, origin
    } = params;

    const serviceListPage = await fetchServiceList({ origin });
    const serviceListHTML = await serviceListPage.text();
    const $ = cheerio.load(serviceListHTML);
    const state: DepartureState = await getDepartureState($, undefined, departureId);
    console.log(`[getTrackState] Cheerio loaded HTML`);
    return state || null;
}