import { DepartureState } from '@/schemas/states'
import { AlertTriangle, Check, Hourglass, WatchIcon } from 'lucide-react'
import React from 'react'

type Props = {
    status: DepartureState['status']
}

function StatusGlyph({ status }: Props) {
    return (<>
        {status === "Go" && <Check className="inline-block w-4 h-4 ml-2 text-white opacity-20" />}
        {status === "Wait" && <Check className="inline-block w-4 h-4 ml-2 text-white opacity-20" />}
        {status === "Prepare" && <Hourglass className="inline-block w-4 h-4 ml-2 text-white opacity-20" />}
        {status === "Unknown" && <AlertTriangle className="inline-block w-4 h-4 ml-2 text-white opacity-20" />}
    </>)
}

export default StatusGlyph