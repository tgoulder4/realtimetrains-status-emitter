import { Hono } from 'hono'
type Station = {
  code: string;
  name: string;
}

type Departure = {
  status: "Loading" | "Wait" | "Go" | "Changed" | "Error" | "Prepare";
  platform: {
    number: string;
  };
  scheduledDepartureTime: string;
  destination: Station;
  callingAt: Station[];
  provider: string;
  rushBeatenCount: number;
}

const stations: Station[] = [
  { code: "EUS", name: "London Euston" },
  { code: "BHM", name: "Birmingham New Street" },
  { code: "TRI", name: "Tring" },
  { code: "WFJ", name: "Watford Junction" },
  { code: "MKC", name: "Milton Keynes Central" },
  { code: "COV", name: "Coventry" },
  { code: "LIV", name: "Liverpool Lime Street" },
  { code: "MAN", name: "Manchester Piccadilly" },
  { code: "GLA", name: "Glasgow Central" },
]

const app = new Hono()
app.get('/', async (c) => {
  const newDepartures: Departure[] = [
    { status: "Prepare", platform: { number: "1" }, scheduledDepartureTime: "13:16", destination: stations[1], callingAt: [stations[4], stations[1]], provider: "Avanti West Coast", rushBeatenCount: 3 },
    { status: "Prepare", platform: { number: "3" }, scheduledDepartureTime: "13:24", destination: stations[2], callingAt: [stations[3], stations[2]], provider: "London Northwestern Railway", rushBeatenCount: 2 },
    { status: "Prepare", platform: { number: "5" }, scheduledDepartureTime: "13:30", destination: stations[3], callingAt: [stations[3]], provider: "London Overground", rushBeatenCount: 1 },
    { status: "Wait", platform: { number: "2" }, scheduledDepartureTime: "13:45", destination: stations[1], callingAt: [stations[4], stations[5], stations[1]], provider: "Avanti West Coast", rushBeatenCount: 4 },
    { status: "Wait", platform: { number: "4" }, scheduledDepartureTime: "13:55", destination: stations[4], callingAt: [stations[3], stations[4]], provider: "London Northwestern Railway", rushBeatenCount: 5 },
    { status: "Wait", platform: { number: "6" }, scheduledDepartureTime: "14:10", destination: stations[6], callingAt: [stations[4], stations[1], stations[6]], provider: "Avanti West Coast", rushBeatenCount: 6 },
    { status: "Wait", platform: { number: "7" }, scheduledDepartureTime: "14:25", destination: stations[7], callingAt: [stations[4], stations[1], stations[7]], provider: "Avanti West Coast", rushBeatenCount: 7 },
    { status: "Wait", platform: { number: "8" }, scheduledDepartureTime: "14:40", destination: stations[8], callingAt: [stations[1], stations[5], stations[8]], provider: "Avanti West Coast", rushBeatenCount: 8 },
    { status: "Wait", platform: { number: "9" }, scheduledDepartureTime: "14:55", destination: stations[5], callingAt: [stations[4], stations[5]], provider: "West Midlands Trains", rushBeatenCount: 2 },
    { status: "Wait", platform: { number: "10" }, scheduledDepartureTime: "15:10", destination: stations[7], callingAt: [stations[4], stations[1], stations[7]], provider: "TransPennine Express", rushBeatenCount: 3 },
  ]

  // Randomly change some departures to "Go" status
  const departures = newDepartures.map(departure => {
    if (Math.random() < 0.2) {  // 20% chance to change to "Go"
      return { ...departure, status: "Go" as Departure['status'] }
    }
    return departure
  })

  return c.json(departures)
})
// General error handling
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app;