import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

const Client = sequelize.define('client', {
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
  email: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  password: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(45),
    defaultValue: null
  },
  pay_methods: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  balance: {
    type: DataTypes.FLOAT,
    allowNull: true
  }
}, {
  tableName: 'clients',
  timestamps: false
});

export default Client;