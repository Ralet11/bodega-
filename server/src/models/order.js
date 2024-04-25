import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

import User from './user.js'; // Suponiendo que tengas un modelo de User en otro archivo
import Local from './local.js'; // Suponiendo que tengas un modelo de Local en otro archivo

const Order = sequelize.define('order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  delivery_fee: {
    type: DataTypes.FLOAT,
    defaultValue: null
  },
  total_price: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  order_details: {
    type: DataTypes.JSON,
    allowNull: false
  },
  local_id: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  users_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  date_time: {
    type: DataTypes.DATE,
    defaultValue: null
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: false
});

// Definición de la relación con la tabla de users
Order.belongsTo(User, { foreignKey: 'users_id', as: 'user' });

// Definición de la relación con la tabla de local
Order.belongsTo(Local, { foreignKey: 'local_id', as: 'local' });

export default Order;
