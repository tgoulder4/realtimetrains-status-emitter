import { fetchServiceList } from '@/core-actions/core/utils/fetch-service-list'
import { addCreditsDA, decrementCreditsDA, getCreditsDA } from '@/data-access/credits'
import { DepartureState } from '@/schemas/departure'
import { FindServicesParams, TrackStatusParams } from '@/schemas/trackStatus'
import cheerio from 'cheerio';
import { env } from '@/env';
import { fetchCallingPoints } from './find';
import { findStationCodeByName } from '@/lib/destinations';
import { getStatus } from './utils/get-status';


// Mock data structure based on the provided HTML
const trainServices = [
  {
    status: "Go",
    platform: { number: "5" },
    scheduledDepartureTime: "0531",
    destination: { code: "GLA", name: "Glasgow Central" },
    callingAt: [{ code: "BHM", name: "Birmingham New Street" }],
    provider: "VT",

  },
  // Add more mock data here...
] as DepartureState[]


//for /track
export async function getDepartureStateCA(params: TrackStatusParams): Promise<DepartureState | null> {
  console.log(`[getDepartureStateCA] Fetching departure state for params:`, params)
  const {
    departureId, origin
  } = params;

  const serviceListPage = await fetchServiceList({ origin });
  const serviceListHTML = await serviceListPage.text();
  const $ = cheerio.load(serviceListHTML);
  const state: DepartureState = await getDepartureState($, undefined, departureId);
  console.log(`[fetchAndParseDepartures] Cheerio loaded HTML`);
  return state || null
}

//for /find
export async function fetchAndParseDeparturesCA(params: FindServicesParams): Promise<DepartureState[] | null> {
  console.log(`[getDepartureStateCA] Fetching departure state for params:`, params)
  const {
    origin
  } = params;

  const serviceListPage = await fetchServiceList({ origin });
  const serviceListHTML = await serviceListPage.text();
  const $ = cheerio.load(serviceListHTML);
  const deps: DepartureState[] = await fetchAndParseDepartures($);
  console.log(`[fetchAndParseDepartures] Cheerio loaded HTML`);
  return deps || null
}

//for /find
export async function fetchAndParseDepartures($: cheerio.Root): Promise<DepartureState[]> {
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

/**
 * For the /track page. Fetches and parses a single departure from a given service element
 * @param service 
 * @param url 
 * @param $ 
 * @returns 
 */
export async function getDepartureState($: cheerio.Root, service?: cheerio.Element, departureId?: string, includeCallingPoints?: boolean): Promise<DepartureState> {
  if (!service && !departureId) throw new Error('Either service or departureId must be provided');
  if (!service) {
    service = $(`.service .tid:contains("${departureId}")`).closest('.service').get(0);
    console.log(`[getDepartureState] Found service by ID: ${departureId}`);
  }
  const $service = $(service);
  const status = getStatus($service);

  const destinationName = $service.find('.location.d span').text().trim();
  console.log(`[getDepartureState] Destination name: ${destinationName}`);
  const destinationCode = findStationCodeByName(destinationName);
  console.log(`[getDepartureState] Found destination code: ${destinationCode}`);

  const scheduledDepartureTime = $service.find('.time.plan.d').text().trim();
  const platformNumber = $service.find('.platform').text().trim();
  const provider = $service.find('.toc').text().trim();

  const serviceUrl = $service.attr('href');
  const callingAt = serviceUrl && includeCallingPoints ? await fetchCallingPoints(new URL(serviceUrl, env.RTT_BASE_URL).toString()) : [];

  const departure: DepartureState = {
    status: status !== null ? status : 'Unknown',
    platform: { number: platformNumber },
    scheduledDepartureTime,
    destination: {
      code: destinationCode || '',
      name: destinationName
    },
    callingAt,
    provider
  };
  console.log(`[getDepartureState] Processed departure:`, departure);
  return departure;
}
