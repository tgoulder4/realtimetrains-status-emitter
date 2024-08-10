import { Server } from "socket.io";

import express from "express";
import { createServer } from "http"; //if problems arise change this to const {createServer} = require("node:http");

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('a user is now connected');
    //if more than one user is connected, start a timer executing function fn every 5 secondfs
    if (io.engine.clientsCount > 1) {
        setInterval(() => {
            socket.emit('message', 'Hello from server');
        }, 5000);
    }
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, () => {
    console.log('server running at http://localhost:3000');
});