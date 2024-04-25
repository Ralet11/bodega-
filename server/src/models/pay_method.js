import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

const PayMethod = sequelize.define('pay_method', {
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
  image: {
    type: DataTypes.STRING(200),
    defaultValue: null
  }
}, {
  tableName: 'pay_methods',
  timestamps: false
});

export default PayMethod;
