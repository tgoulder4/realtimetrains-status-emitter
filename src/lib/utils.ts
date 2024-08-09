import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { stationNamesWithCodes } from "./map"

export function checkTrueDestinationName(destination: string) {
  return stationNamesWithCodes.find(station => station.StationName === destination) ? true : false
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
