import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

const StatusBalance = sequelize.define('statusBalance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
}, {
  tableName: 'status_balances',
  timestamps: false
});

export default StatusBalance;
