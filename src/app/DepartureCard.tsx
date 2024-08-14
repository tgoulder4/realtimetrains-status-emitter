import React from 'react'
import { Service } from '@/lib/types'
import { Badge } from "@/components/ui/badge"
import { checkStationIsPopular } from '@/lib/utils'
import { getColourFromStatus } from './track/getRenderInfoFromState'

type Props = {
    partialDepartureInfo: {
        destination: Service["destination"],
        scheduledDepartureTime: string,
        provider: string,
        via?: string,
    },
    status?: Service["status"],
    isPopular?: boolean,
    className?: string,
    shouldntDisplace?: boolean,
    onClick?: () => void
}
export function CardPrim({ children, shouldDisplaceOnHover, className, onClick }: { children: React.ReactNode, shouldDisplaceOnHover?: boolean, className?: string, onClick?: () => void }) {
    return <div onClick={onClick} className={`cursor-pointer flex flex-row items-center gap-4 px-4 py-5 ${shouldDisplaceOnHover ? "transform hover:translate-y-1 transition duration-100 border-b-4 hover:border-0 border-black/10 " : ""} ${className}`}>{children}</div>
}
function DepartureCard({ partialDepartureInfo, isPopular, status, className, onClick, shouldntDisplace }: Props) {
    const { destination: { name, code }, scheduledDepartureTime, provider, via } = partialDepartureInfo
    return (
        <CardPrim onClick={onClick} className={`bg-white h-fit ${className}`} shouldDisplaceOnHover={!shouldntDisplace}>
            {status && <div className={`h-8 w-8 ${getColourFromStatus(status)}`} ></div>}
            <h2 className={`text-xl font-bold text-black`}>{scheduledDepartureTime}</h2>
            <div className="flex flex-col items-start w-full">
                <h3 className='font-bold'>{name}</h3>
                <div className="flex flex-row justify-between items-end w-full">
                    {via &&
                        <div className="flex flex-row w-full  gap-2">
                            <p className='opacity-50'>Via {via}</p>
                            {isPopular ? <Badge className='bg-[#D2F3FA]' variant="default">Badge</Badge> : <></>}
                        </div>}
                    {provider && <p className='opacity-50 w-full text-end ml-4'>{provider}</p>}
                </div>
            </div>
        </CardPrim>
    )
}

export default DepartureCard