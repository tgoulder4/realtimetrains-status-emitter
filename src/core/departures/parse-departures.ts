import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { DepartureState } from '@/schemas/departure';
import { findStationCodeByName } from '@/lib/destinations';
// Constant for minimum time to poll (5 minutes in milliseconds)
const MIN_TIME_TO_POLL = 5 * 60 * 1000;

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

/**
 * Determines the status of a train service based on platform class and time
 * @param $service - Cheerio object representing a train service
 * @returns The status of the train service or null if undetermined
 */
function getStatus($service: cheerio.Cheerio): DepartureState['status'] | null {
  console.log(`[getStatus] Analyzing service: ${$service.find('.location.d span').text().trim()}`);
  const platform = $service.find('.platform');
  console.log(`[getStatus] Platform class: ${platform.attr('class')}`);

  // Check if the platform has class 'ex' (expected)
  if (platform.hasClass('ex')) {
    const scheduledTime = $service.find('.time.plan.d').text().trim();
    console.log(`[getStatus] Scheduled time: ${scheduledTime}`);
    const currentTime = convertDateToUTC(new Date());
    console.log(`[getStatus] Current time (UTC): ${currentTime}`);
    const scheduledDate = parseTime(scheduledTime, currentTime);
    console.log(`[getStatus] Scheduled date (UTC): ${scheduledDate}`);
    const timeDiff = scheduledDate.getTime() - currentTime.getTime();
    console.log(`[getStatus] Time difference: ${timeDiff} ms`);
    const status = timeDiff > MIN_TIME_TO_POLL ? 'Prepare' : 'Wait';
    console.log(`[getStatus] Determined status: ${status}`);
    return status;
  } else if (platform.hasClass('a') || platform.hasClass('c')) {
    // 'a' for arrived, 'c' for changed
    console.log(`[getStatus] Platform is active or changed, status: Go`);
    return 'Go';
  }
  console.log(`[getStatus] Unable to determine status, returning null`);
  return null;
}

async function fetchServiceDetails(url: string): Promise<DepartureState['callingAt']> {
  console.log(`[fetchServiceDetails] Fetching service details from: ${url}`);
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

    console.log(`[fetchServiceDetails] Parsed ${callingPoints.length} calling points`);
    return callingPoints;
  } catch (error) {
    console.error(`[fetchServiceDetails] Error fetching service details:`, error);
    return [];
  }
}


/**
 * Parses a time string and converts it to a Date object
 * @param timeString - The time string to parse (format: "HH:MM")
 * @param referenceDate - The reference date to use
 * @returns A Date object representing the parsed time
 */
function parseTime(timeString: string, referenceDate: Date): Date {
  console.log(`[parseTime] Parsing time: ${timeString}, Reference date: ${referenceDate}`);
  const [hours, minutes] = timeString.split(':').map(Number);
  console.log(`[parseTime] Parsed hours: ${hours}, minutes: ${minutes}`);
  const date = convertDateToUTC(new Date(referenceDate));
  date.setUTCHours(hours, minutes, 0, 0);
  console.log(`[parseTime] Initial parsed date: ${date}`);
  if (date < referenceDate) {
    date.setUTCDate(date.getUTCDate() + 1);
    console.log(`[parseTime] Date adjusted to next day: ${date}`);
  }
  console.log(`[parseTime] Final parsed date: ${date}`);
  return date;
}

/**
 * Fetches and parses departure information from a given URL
 * @param url - The URL to fetch departure information from
 * @returns An array of DepartureState objects
 */
export async function fetchAndParseDepartures(url: string): Promise<DepartureState[]> {
  console.log(`[fetchAndParseDepartures] Starting to fetch departures from: ${url}`);
  try {
    // Fetch the HTML content from the provided URL
    const response = await fetch(url);
    console.log(`[fetchAndParseDepartures] Fetch response status: ${response.status}`);
    const html = await response.text();
    console.log(`[fetchAndParseDepartures] Received HTML length: ${html.length}`);

    // Load the HTML content into Cheerio for parsing
    const $ = cheerio.load(html);
    console.log(`[fetchAndParseDepartures] Cheerio loaded HTML`);

    const departures: DepartureState[] = await Promise.all($('.servicelist .service').map(async (_, service) => {
      console.log(`[fetchAndParseDepartures] Processing service ${_ + 1}`);
      const $service = $(service);
      const status = getStatus($service);

      const destinationName = $service.find('.location.d span').text().trim();
      console.log(`[fetchAndParseDepartures] Destination name: ${destinationName}`);
      const destinationCode = await findStationCodeByName(destinationName);
      console.log(`[fetchAndParseDepartures] Found destination code: ${destinationCode}`);

      const scheduledDepartureTime = $service.find('.time.plan.d').text().trim();
      const platformNumber = $service.find('.platform').text().trim();
      const provider = $service.find('.toc').text().trim();

      const serviceUrl = $service.attr('href');
      const callingAt = serviceUrl ? await fetchServiceDetails(new URL(serviceUrl, url).toString()) : [];

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
      console.log(`[fetchAndParseDepartures] Processed departure:`, departure);
      return departure;
    }).get());

    console.log(`[fetchAndParseDepartures] Parsed ${departures.length} departures`);
    return departures;
  } catch (error) {
    console.error(`[fetchAndParseDepartures] Error fetching and parsing departures:`, error);
    throw new Error('Failed to fetch and parse departures');
  }
}