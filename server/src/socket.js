import { Server as SocketIO } from "socket.io";
import { FRONTEND_URL } from "./config.js";
let io;

const initializeSocket = (server) => {
  io = new SocketIO(server, {
    cors: {
      origin: `${FRONTEND_URL}`, // Ajusta según tu necesidad
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Cliente WebSocket conectado.");
    socket.on("disconnect", () => {
      console.log("Cliente WebSocket desconectado.");
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export { initializeSocket, getIo };