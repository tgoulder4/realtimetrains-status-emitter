'use client'
import React from 'react'
import WebSocket from 'ws';

const ws = new WebSocket('ws://www.host.com/path');

ws.on('error', console.error);

ws.on('open', function open() {
    ws.send('something');
});

ws.on('message', function message(data) {
    console.log('received: %s', data);
});
type Props = {}

function TrackPage({ }: Props) {
    return (
        <div>TrackPage</div>
    )
}

export default TrackPage