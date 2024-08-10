import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { stationNamesWithCodes } from "./map"

export function checkStationIsPopular(stationName: string) {
  const popularStations = ['Birmingham New Street', "Manchester Piccadilly", "Crewe",
    "London Euston", "London Kings Cross", "London St Pancras International", "London Liverpool Street",
    "London Paddington", "London Victoria", "London Waterloo", "London Bridge", "London Charing Cross",
    "London Cannon Street", "Birmingham Moor Street", "Birmingham Snow Hill", "Birmingham International",
    "Manchester Victoria", "Manchester Oxford Road", "Manchester Airport", "Manchester Deansgate",
  ]
  return popularStations.includes(stationName)
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function addIfNewOrRemoveIfExistingItemFromArray<T>(arr: T[], item: T) {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item]
}