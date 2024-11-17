import { env } from "@/env";


interface FetchOptions {
    origin?: string;
}

const BASE_URL = 'https://www.realtimetrains.co.uk/search/detailed/gb-nr:';
const PROXY_URL = 'https://proxy.scrapeops.io/v1/';
const MAX_RETRIES = 2;

export async function fetchServiceList({ origin = 'EUS' }: FetchOptions = {}): Promise<Response> {
    const isProduction = env.NODE_ENV === "production" || Boolean(env.prod_override_true_if_nonempty);
    const fullUrl = `${BASE_URL}${origin}`;

    console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);

    let url: string;
    let retries = 0;

    while (retries <= MAX_RETRIES) {
        try {
            if (isProduction) {
                url = useProxy(fullUrl);
            } else {
                url = 'http://localhost:3000/tests/departuresNoAim'; // For testing
            }

            const res = await fetch(url);

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            return res;
        } catch (error) {
            console.error(`Attempt ${retries + 1} failed:`, error);

            if (isProduction && retries === 0) {
                console.log("Retrying without proxy...");
                url = fullUrl;
            } else if (retries === MAX_RETRIES) {
                throw new Error(`Failed to fetch data after ${MAX_RETRIES} attempts.`);
            }

            retries++;
        }
    }

    throw new Error("Unexpected error occurred.");
}

function useProxy(targetUrl: string): string {
    return `${PROXY_URL}${new URLSearchParams({
        api_key: env.SCRAPEOPS_API_KEY,
        url: targetUrl
    })}`;
}