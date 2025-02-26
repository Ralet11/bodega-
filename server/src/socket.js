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
    console.log(`Cliente WebSocket conectado: ${socket.id}`);
    
    // Escuchar el evento 'joinRoom' para unir al socket a un room específico
    socket.on("joinRoom", (userId) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} se unió al room ${userId}`);
      console.log("Rooms actuales del socket:", socket.rooms);
    });
    
    socket.on("disconnect", () => {
      console.log(`Cliente WebSocket desconectado: ${socket.id}`);
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
