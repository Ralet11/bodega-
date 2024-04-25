import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

import User from './user.js'; // Suponiendo que tengas un modelo de User en otro archivo

const Address = sequelize.define('address', {
  adressID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  street_number: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  unit_number: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  address_line1: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  address_line2: {
    type: DataTypes.STRING(45),
    defaultValue: null
  },
  city: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  postal_code: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  users_id: {
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
  }
}, {
  tableName: 'adresses',
  timestamps: false
});

// Definición de la relación con la tabla de usuarios
Address.belongsTo(User, { foreignKey: 'users_id', as: 'user' });

export default Address;