import { Server } from "socket.io";
import { logoutSocket, registerSocket } from "./socket.auth.js";
import { joinRoom, leaveRoom, sendMessage } from "./service/room.service.js";

export const runIo=async(httpServer)=>{
    const io = new Server(httpServer,{
        cors:'*'
    })

    return io.on('connection',async(socket)=>{
        await registerSocket(socket)

        await logoutSocket(socket)
        socket.on("joinRoom", (roomId) => joinRoom(socket, io, roomId));
        socket.on("leaveRoom", (roomId) => leaveRoom(socket, io, roomId));
        socket.on("sendMessage", (roomId, message) => sendMessage(socket, io, roomId, message));

    })
}