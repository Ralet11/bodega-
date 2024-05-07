import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

import Client from './client.js'; // Suponiendo que tengas un modelo de Client en otro archivo
import LocalCategory from './local_category.js'; // Suponiendo que tengas un modelo de LocalCategory en otro archivo

const Local = sequelize.define('local', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(80),
    allowNull: false
  },
  img: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  status: {
    type: DataTypes.STRING(45),
    defaultValue: null
  },
  phone: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  clients_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  lat: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  lng: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(50),
    defaultValue: null
  },
  locals_categories_id: {
    type: DataTypes.INTEGER,
    defaultValue: null
  }
}, {
  tableName: 'local',
  timestamps: false
});

// Definición de la relación con la tabla de clients
Local.belongsTo(Client, { foreignKey: 'clients_id', as: 'client' });

// Definición de la relación con la tabla de locals_categories
Local.belongsTo(LocalCategory, { foreignKey: 'locals_categories_id', as: 'local_category' });

export default Local;
