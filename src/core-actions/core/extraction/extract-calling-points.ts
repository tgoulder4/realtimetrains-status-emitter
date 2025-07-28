import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { DepartureState } from '@/schemas/states';
import { findStationCodeByName } from '@/lib/destinations';
import { env } from '@/env';

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
