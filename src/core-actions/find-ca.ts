import { FindServicesParams } from './../schemas/trackStatus';
import cheerio from 'cheerio';
import { DepartureState } from '../schemas/states';
import { fetchServiceList } from "./core/utils/fetch-service-list";
import { getDepartureState } from './core/main';


//for /find
export async function fetchAndParseDeparturesCA(params: FindServicesParams): Promise<DepartureState[] | null> {
    console.log(`[getDepartureStateCA] Fetching departure state for params:`, params)
    const {
        origin
    } = params;

    const serviceListPage = await fetchServiceList({ origin });
    const serviceListHTML = await serviceListPage.text();
    const $ = cheerio.load(serviceListHTML);

    console.log(`[fetchAndParseDepartures] Fetching and parsing departures`);
    try {
        const departures: DepartureState[] = await Promise.all($('.servicelist .service').map(async (serviceNo, service) => getDepartureState($, service, undefined, true)).get());
        console.log(`[fetchAndParseDepartures] Parsed ${departures.length} departures`);
        return departures;
    } catch (error) {
        console.error(`[fetchAndParseDepartures] Error fetching and parsing departures:`, error);
        throw new Error('Failed to fetch and parse departures');
    }
}

