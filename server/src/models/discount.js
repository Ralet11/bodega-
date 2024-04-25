import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

import Local from './local.js';

const Discount = sequelize.define('discount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  initialPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  discountPrice: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  limitDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  local_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  percentage: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  order_details: {
    type: DataTypes.JSON,
    allowNull: false
  }
}, {
  tableName: 'discounts',
  timestamps: false
});

// Definición de la relación con la tabla de locales
Discount.belongsTo(Local, { foreignKey: 'local_id', as: 'local' });

export default Discount;