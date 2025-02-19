import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Sequelize } from 'sequelize';
import process from 'process';
import configData from '../config/config.json' assert { type: "json" };

// Para convertir import.meta.url a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'development';
const config = configData[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 1) Leemos los archivos de la carpeta actual
const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&                  // Ignora archivos ocultos
      file !== path.basename(__filename) &&       // Ignora este mismo archivo (index.js)
      file.endsWith('.js') &&                     // Solo .js
      !file.includes('.test.js')                  // Ignora archivos de prueba
    );
  });

// 2) Importamos dinámicamente cada modelo
for (const file of modelFiles) {
  // Construimos la ruta absoluta
  const fullPath = path.join(__dirname, file);

  // Convertimos la ruta a una URL con "file://"
  const fileUrl = pathToFileURL(fullPath).href;

  // Importamos el archivo, extrayendo la exportación por defecto
  const { default: modelInit } = await import(fileUrl);

  // Ejecutamos la función exportada (modelInit) para definir el modelo
  const model = modelInit(sequelize, Sequelize.DataTypes);

  // Guardamos la clase del modelo en el objeto db, usando su nombre
  db[model.name] = model;
}

// 3) Llamamos a "associate" en cada modelo, para establecer relaciones
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// 4) Exportamos el objeto sequelize y el objeto con los modelos
export { sequelize };
export default db;
