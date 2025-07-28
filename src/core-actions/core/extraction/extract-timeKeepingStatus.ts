import { parseTime } from "../utils/time-handling";

function extractTimeKeepingStatuses($: cheerio.Root) {
    const services = $('.service');

    const results = services.map((index, element) => {
        const $service = $(element);

        let timeKeepingStatus = 'Unknown';

        if ($service.find('.time.real.d.act.c.rt').length) {
            timeKeepingStatus = 'OnTime';
        } else if ($service.find('.time.real.d.act.c.late').length) {
            timeKeepingStatus = 'Late';
        } else if ($service.find('.time.real.d.act.c.early').length) {
            timeKeepingStatus = 'Early';
        } else if ($service.find('.time.real.a.canx').length) {
            timeKeepingStatus = 'Cancelled';
        }
        return timeKeepingStatus;
    }).get();

    return results;
}

export function extractTimeKeepingStatusFromOneDetailedView($: cheerio.Root, originCode: string) {
    const locationList = $('.locationlist');
    const locations = locationList.find('.location');

    let timeKeepingStatus = 'Unknown';
    let departureTime = '';
    let actualDepartureTime = '';
    let platformChanged = false;

    locations.each((index, element) => {
        const location = $(element);
        const locationName = location.find('.location .name').text();
        const isOrigin = locationName.includes(originCode);

        if (isOrigin) {
            const platform = location.find('.platform');
            platformChanged = platform.hasClass('chg');

            const wttDep = location.find('.wtt .dep').text();
            const realDep = location.find('.realtime .dep').text();

            departureTime = wttDep;
            actualDepartureTime = realDep;

            if (realDep.includes('Cancel')) {
                timeKeepingStatus = 'Cancelled';
            } else if (wttDep && realDep) {
                const wttTime = parseTime(wttDep, new Date());
                const realTime = parseTime(realDep, new Date());

                if (realTime < wttTime) {
                    timeKeepingStatus = 'Early';
                } else if (realTime > wttTime) {
                    timeKeepingStatus = 'Late';
                } else {
                    timeKeepingStatus = 'OnTime';
                }
            }

            return false; // Stop iterating after processing the origin
        }
    });

    return {
        timeKeepingStatus,
        departureTime,
        actualDepartureTime,
        platformChanged
    };
}
