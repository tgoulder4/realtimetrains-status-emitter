'use client'
import React, { useState } from 'react'
import WebSocket from 'ws';
import { env } from '@/env';
import { TrackState } from '@/lib/types';
import { maxWidthClassNames } from '@/lib/layout';

type Props = {
    servicesToTrack: { destCode: string, depTime: string }[]
}

function MainTrackingArea({ servicesToTrack }: Props) {
    const [state, setState] = useState<TrackState>({
        data: {
            status: "Wait...",
            platform: "0",
        },
        hidden: {
            timeTillRefresh: 5
        }
    })
    //url like http://localhost:3000/track?trains=1940BHM+1200MAN
    return (
        <div className="flex min-h-screen h-full flex-col">
            <script src="/socket.io/socket.io.js"></script>
            <script>
                {/* const socket = io(); */}
            </script>
        </div>
    )
}

export default MainTrackingArea