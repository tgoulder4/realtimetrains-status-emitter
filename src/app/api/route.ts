import express from "express";
import http from "http";
import path from "path";

const app = express();
app.get("/", (req, res) => {
    res.send("test")
})
app.listen(3000, () => {
    console.log("Server running on port 3000")
})
// const server = http.createServer(app);
// const io = new Server(server);

// io.on("connection", (socket: Socket) => {
//     console.log("A user connected");

//     socket.on("disconnect", () => {
//         console.log("User disconnected");
//     });

//     socket.on("chat message", (msg: string) => {
//         console.log("message: " + msg);
//         io.emit("chat message", msg);
//     });
// });
// app.get("/", (req, res) => {
//     res.send("test")
// });

// const PORT = 3000;

// server.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });