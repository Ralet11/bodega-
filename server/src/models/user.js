import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; 

const User = sequelize.define('user', {
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
    type: DataTypes.STRING(130),
    allowNull: true, // Puede ser nulo para usuarios que se registran con Google
  },
  birthdate: {
    type: DataTypes.STRING(45),
    defaultValue: null
  },
  phone: {
    type: DataTypes.STRING(45),
    allowNull: true // Puede ser nulo para usuarios que se registran con Google
  },
  subscription: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  balance: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  savings: {
    type: DataTypes.FLOAT(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  authMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'local' // Puede ser 'local' o 'google' para diferenciar el método de autenticación
  }
}, {
  tableName: 'users',
  timestamps: false
});

export default User;
