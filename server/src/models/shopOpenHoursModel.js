import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Local from './local.js'; // Importa el modelo Local para la relación

const ShopOpenHours = sequelize.define('ShopOpenHours', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  local_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'local', // Nombre de la tabla relacionada
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  day: {
    type: DataTypes.STRING(15), // Suficiente para nombres de días como 'Monday'
    allowNull: false
  },
  open_hour: {
    type: DataTypes.TIME,
    allowNull: false
  },
  close_hour: {
    type: DataTypes.TIME,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'ShopOpenHours',
  timestamps: true
});



export default ShopOpenHours;
