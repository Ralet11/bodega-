import app from "./server.js";
import { sequelize } from "./models/index.js";
import { initializeSocket } from "./socket.js";
import { FRONTEND_URL } from "./config.js";
import fs from 'fs';
import http from 'http';
import https from 'https';

// Determina el ambiente actual (production o development)
const currentEnvironment = process.env.NODE_ENV || 'development';

// Sincroniza los modelos; en producción se recomienda evitar alteraciones automáticas
sequelize.sync({ alter: currentEnvironment !== 'production' }).then(() => {
  if (currentEnvironment === 'production') {
    // Configuración para el servidor en producción (HTTPS)
    const privateKey = fs.readFileSync('./../../certificados/private.key', 'utf8');
    const certificate = fs.readFileSync('./../../certificados/certificate.crt', 'utf8');
    const ca = fs.readFileSync('./../../certificados/ca_bundle.crt', 'utf8');
    const httpsCredentials = { key: privateKey, cert: certificate, ca: ca };

    const productionServer = https.createServer(httpsCredentials, app);
    productionServer.listen(443, () => {
      console.log('Servidor HTTPS en producción está escuchando en el puerto 443');
      initializeSocket(productionServer);
    });
  } else {
    // Configuración para el servidor en desarrollo (HTTP)
    const developmentServer = http.createServer(app);
    developmentServer.listen(80, () => {
      console.log('Servidor HTTP en desarrollo está escuchando en el puerto 80');
      initializeSocket(developmentServer);
    });
  }
}).catch(error => {
  console.error('Error al sincronizar los modelos:', error);
});
