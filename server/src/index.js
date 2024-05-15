import app from "./server.js";
import sequelize from "./database.js";

import { FRONTEND_URL } from "./config.js";

import fs from 'fs';
import https from 'https'




sequelize.sync({ force: false }).then(() => {
  const privateKey = fs.readFileSync('./../certificados/private.key', 'utf8');
  const certificate = fs.readFileSync('./../certificados/certificate.crt', 'utf8');
  const ca = fs.readFileSync('./../certificados/ca_bundle.crt', 'utf8');
  
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
    console.log('Servidor HTTPS está escuchando en el puerto 443');
  }); 
   
  }).catch(error => {
    console.error('Unable to synchronize the models:', error);
  });

  /*
import app from "./server.js";
import sequelize from "./database.js";
import fs from 'fs';
import https from 'https';
import { Server as SocketIO } from 'socket.io';

sequelize.sync({ force: false }).then(() => {
  const privateKey = fs.readFileSync('./../certificados/private.key', 'utf8');
  const certificate = fs.readFileSync('./../certificados/certificate.crt', 'utf8');
  const ca = fs.readFileSync('./../certificados/ca_bundle.crt', 'utf8');
  
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  
  const httpsServer = https.createServer(credentials, app);
  const io = new SocketIO(httpsServer, {
    cors: {
      origin: "*", // Asegúrate de configurar correctamente los CORS según tus necesidades
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Cliente WebSocket conectado.");

    socket.emit("message", "¡Conexión establecida!");
    socket.on("message", (message) => {
      console.log(`Mensaje recibido: ${message}`);
    });
    socket.on("disconnect", () => {
      console.log("Cliente WebSocket desconectado.");
    });
  });

  httpsServer.listen(443, () => {
    console.log('Servidor HTTPS está escuchando en el puerto 443');
  }); 
}).catch(error => {
  console.error('Unable to synchronize the models:', error);
});*/