import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { DepartureState } from '@/schemas/departure';
import { findStationCodeByName } from '@/lib/destinations';
import { env } from '@/env';
import { fetchAndParseDeparture } from './track';

/**
 * Converts a given date to UTC
 * @param date - The date to convert
 * @returns The date in UTC
 */
export function convertDateToUTC(date: Date): Date {
  console.log(`[convertDateToUTC] Input date: ${date}`);
  const UTCDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
  console.log(`[convertDateToUTC] Converted UTC date: ${UTCDate}`);
  console.log(`[convertDateToUTC] Formatted UTC time: ${UTCDate.getHours() < 10 ? "0" + UTCDate.getUTCHours() : UTCDate.getHours()}:${UTCDate.getMinutes() < 10 ? "0" + UTCDate.getMinutes() : UTCDate.getMinutes()}`);
  return UTCDate;
}


export async function fetchCallingPoints(url: string): Promise<DepartureState['callingAt']> {
  console.log(`[fetchCallingPoints] Fetching service details from: ${url}`);
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const callingPoints = $('.location.call.public').map((_, element) => {
      const $element = $(element);
      const name = $element.find('.location a').text().trim();
      const code = $element.find('.location a').attr('href')?.split('/').pop() || '';
      const scheduledTime = $element.find('.gbtt .dep').text().trim();
      return { name, code, scheduledTime };
    }).get();

    console.log(`[fetchCallingPoints] Parsed ${callingPoints.length} calling points`);
    return callingPoints;
  } catch (error) {
    console.error(`[fetchCallingPoints] Error fetching service details:`, error);
    return [];
  }
}



/**
 * Fetches and parses departure information from a given URL
 * @param url - The URL to fetch departure information from
 * @returns An array of DepartureState objects
 */
export async function fetchAndParseDepartures($: cheerio.Root): Promise<DepartureState[]> {
  console.log(`[fetchAndParseDepartures] Fetching and parsing departures`);
  try {

    const departures: DepartureState[] = await Promise.all($('.servicelist .service').map(async (serviceNo, service) => fetchAndParseDeparture($, service)).get());

    console.log(`[fetchAndParseDepartures] Parsed ${departures.length} departures`);
    return departures;
  } catch (error) {
    console.error(`[fetchAndParseDepartures] Error fetching and parsing departures:`, error);
    throw new Error('Failed to fetch and parse departures');
  }
}
