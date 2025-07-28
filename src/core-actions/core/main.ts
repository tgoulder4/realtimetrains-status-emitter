import { fetchServiceList } from '@/core-actions/core/utils/fetch-service-list'
import { addCreditsDA, decrementCreditsDA, getCreditsDA } from '@/data-access/credits'
import { DepartureState } from '@/schemas/states'
import { FindServicesParams, TrackStatusParams } from '@/schemas/trackStatus'
import cheerio from 'cheerio';
import { env } from '@/env';
import { findStationCodeByName } from '@/lib/destinations';
import { getStatus } from './extraction/extract-status';
import { fetchCallingPoints } from './extraction/extract-calling-points';
import { getMillisecondsTilRefresh, getMsUntilDeparture } from './utils/time-handling';

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
  if (!status) throw new Error('Failed to get status');
  const destinationName = $service.find('.location.d span').text().trim();
  console.log(`[getDepartureState] Destination name: ${destinationName}`);
  const destinationCode = findStationCodeByName(destinationName);
  if (!destinationCode) throw new Error('Failed to find destination code');
  console.log(`[getDepartureState] Found destination code: ${destinationCode}`);

  const scheduledDepartureTime = $service.find('.time.plan.d').text().trim();
  const msUntilDeparture = getMsUntilDeparture(scheduledDepartureTime, new Date());
  const millisecondsTilRefresh = getMillisecondsTilRefresh(status, msUntilDeparture);
  const platformNumber = $service.find('.platform').text().trim();
  const provider = $service.find('.toc').text().trim();
  // const tks = extractTimeKeepingStatuses($);


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
    provider,
    millisecondsTilRefresh,
    timeKeepingStatus: "Cancelled"
  };
  console.log(`[getDepartureState] Processed departure:`, departure);
  return departure;
}
