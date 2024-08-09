'use server'
import { checkTrueDestinationName } from '@/lib/utils';
import { redirect } from 'next/navigation';
import React from 'react'
import { getServiceList, Service } from '../utils';
import { ComboBox } from '@/components/ui/combobox';
type Props = {
    searchParams: { [key: string]: string | string[] | undefined },
}

async function PickTimePage({ searchParams }: Props) {
    // console.log("pickTimePage called with searchParams: ", searchParams)
    const destination: string = searchParams.dest as string;
    // if (!destination || !checkTrueDestinationName(destination)) redirect('/');
    const services: Service[] = (await getServiceList(destination)).slice(0, 8);
    // console.log(services);
    return (
        <div>
            <label htmlFor="">Pick a time
                {
                    services.map(service => <a className='flex flex-row gap-4 rounded-md bg-white'>
                        <h3 className='text-2xl font-bold'>{service.departureTime}</h3>
                    </a>)
                }
                <div className="flex flex-row gap-4 rounded-md bg-white"></div>
            </label>
        </div>
    )
}

export default PickTimePage