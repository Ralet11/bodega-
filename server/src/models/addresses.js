import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

import User from './user.js'; // Suponiendo que tengas un modelo de User en otro archivo

const Address = sequelize.define('address', {
  adressID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  users_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  formatted_address: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  houseNumber: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  streetName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  additionalDetails: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  postalCode: {
    type: DataTypes.STRING(20),
    allowNull: false
  }
}, {
  tableName: 'adresses',
  timestamps: false
});

// Definición de la relación con la tabla de usuarios
Address.belongsTo(User, { 
  foreignKey: 'users_id', 
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

export default Address;