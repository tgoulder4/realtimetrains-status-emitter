
import { fetchAndParseDepartures } from '@/core/departures/parse-departures';
import { findStationCodeByName } from '../lib/destinations';
import { DepartureState, DepartureStateSchema } from '../schemas/departure';
import { beforeEach, describe, expect, it, test } from '@jest/globals';
import { jest } from '@jest/globals';
/// Mock the fetch function
const mockedFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>;
global.fetch = mockedFetch;

// Mock the findStationCodeByName function
jest.mock('../lib/destinations', () => ({
    findStationCodeByName: jest.fn(),
}));

describe('fetchAndParseDepartures', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should correctly parse departure information', async () => {
        const mockHtml = `
      <div class="servicelist">
        <a class="service">
          <div class="platform ex">1</div>
          <div class="time plan d">14:30</div>
          <div class="location d">
            <span>London Paddington</span>
          </div>
          <div class="toc">Great Western Railway</div>
          <ul class="calling-points">
            <li>Reading</li>
            <li>Swindon</li>
          </ul>
        </a>
      </div>
    `;

        mockedFetch.mockResolvedValue({
            text: () => Promise.resolve(mockHtml),
            status: 200,
            ok: true,
        } as Response);


        const departures = await fetchAndParseDepartures('http://example.com');

        const expectedDeparture: DepartureState = {
            status: 'Prepare',
            platform: { number: '1' },
            scheduledDepartureTime: '14:30',
            destination: {
                code: 'PAD',
                name: 'London Paddington'
            },
            callingAt: [
                { code: 'RDG', name: 'Reading' },
                { code: 'SWI', name: 'Swindon' },
            ],
            provider: 'Great Western Railway'
        };

        expect(departures).toHaveLength(1);
        expect(departures[0]).toEqual(expectedDeparture);
        expect(DepartureStateSchema.parse(departures[0])).toEqual(expectedDeparture);

        expect(mockedFetch).toHaveBeenCalledWith('http://example.com');
        expect(findStationCodeByName).toHaveBeenCalledTimes(3);
    });

    it('should handle errors gracefully', async () => {
        mockedFetch.mockRejectedValue(new Error('Network error'));

        await expect(fetchAndParseDepartures('http://example.com')).rejects.toThrow('Failed to fetch and parse departures');
    });
});