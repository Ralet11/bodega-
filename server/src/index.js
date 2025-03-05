//LOCAL SERVER


 import app from "./server.js";
import { sequelize } from "./models/index.js";
import { initializeSocket } from "./socket.js";
import { FRONTEND_URL } from "./config.js";

import fs from 'fs';
import http from 'http'


/* 

sequelize.sync({ alter: true }).then(() => {
  
  const httpsServer = http.createServer( app);
  httpsServer.listen(80, () => {
    initializeSocket(httpsServer)
    console.log('Servidor HTTPS está escuchando en el puerto 443');
  }); 
   
  }).catch(error => {
    console.error('Unable to synchronize the models:', error);
  });   */

  //PRODUCTION SERVER

 import app from "./server.js";
import sequelize from "./database.js";
import https from 'https';
import fs from 'fs';
import { initializeSocket } from "./socket.js";
import { FRONTEND_URL } from "./config.js";

sequelize.sync({ force: false }).then(() => {
  const privateKey = fs.readFileSync('./../../certificados/private.key', 'utf8');
  const certificate = fs.readFileSync('./../../certificados/certificate.crt', 'utf8');
  const ca = fs.readFileSync('./../../certificados/ca_bundle.crt', 'utf8');

  const credentials = { key: privateKey, cert: certificate, ca: ca };
  
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(443, () => {
    console.log('Servidor HTTPS está escuchando en el puerto 443');
    initializeSocket(httpsServer);  // Initialize Socket.IO after the HTTPS server starts
  });
}).catch(error => {
  console.error('Unable to synchronize the models:', error);
}); 