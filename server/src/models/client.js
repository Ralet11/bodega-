import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const Client = sequelize.define('client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING(45),
    allowNull: true,
    defaultValue: null,
  },
  pay_methods: {
    type: DataTypes.JSON,
    defaultValue: null,
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  account_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null,
  },
  account_holder_name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: null,
  },
  routing_number: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: null,
  },
}, {
  tableName: 'clients',
  timestamps: false,
});

export default Client;