'use client'
import { findStationCodeByName, stationNamesWithCodes } from "@/lib/map";
import cheerio from 'cheerio'
import { useServerAction } from 'zsa-react'
import { checkTrueDestinationName } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getServiceList, Service } from "./utils";
import { ComboBox } from "@/components/ui/combobox";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form";
import { z } from "zod";
/**
 * 
 * @param srvcs 
 * @returns Unique services. Errors are "MULTIDEST" for multiple destinations.
 */
function findUniqueServices(srvcs: Service[]): Service[] {
  return srvcs.map(station => {
    const stationName = station.destinationStationName;
    //if stationanme contains a comma or an and symbol throw an error
    if (stationName.includes(',') || stationName.includes('&')) {
      return { destinationStationName: "MULTIDEST", departureTime: "--", platform: "0", status: "Error", stationCode: "--" };
    } else {
      return station
    }
  }).filter((value, index, self) => {
    return srvcs.findIndex(station => station.destinationStationName === value.destinationStationName) === index;
  })
}
export default function Home() {
  // const { execute, isPending, error } = useServerAction(submitDestinationSA);
  const formSchema = z.object({ dest: z.string() });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dest: 'BHM',
    }
  });

  const [servicesFromEuston, setServicesFromEuston] = useState<Service[]>([]);
  useEffect(() => {
    async function main() {
      const services = await getServiceList();
      setServicesFromEuston(services);
    }
    main()
  }, []);
  const [errors, setErrors] = useState<string[]>([""]);
  const uniqueServicesFromEuston: Service[] = findUniqueServices(servicesFromEuston)
    .filter(station => {
      if (station.destinationStationName === "MULTIDEST") {
        setErrors(prev => ([...prev, "Some destinations aren't available as multiple destinations aren't yet supported."]));
      }
      return station.destinationStationName !== "MULTIDEST";
    })
  console.log("uniqueServicesFromEuston: ", uniqueServicesFromEuston);



  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <label htmlFor="">Where are you off to?</label>
      <h2>Departing soon:</h2>
      {
        uniqueServicesFromEuston.map(srvc => <a href={`/pickTime?dest=${srvc.stationCode}`} className='flex flex-row items-center gap-4 p-8 rounded-md bg-white'>
          <h3 className='text-2xl font-bold'>{srvc.destinationStationName}</h3>
        </a>)
      }
      {/* <input className="" onChange={() => { error !== null ? setError(null) : null }} type="text" name="dest" id="dest" placeholder="Destination name" /> */}
      {errors?.map(err => <p className="text-red-500">{err}</p>)}
      <button type="submit">Submit</button>
    </main>
  );
}
