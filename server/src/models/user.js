import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

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
    allowNull: false
  },
  birthdate: {
    type: DataTypes.STRING(45),
    defaultValue: null
  },
  phone: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: false
});

export default User;