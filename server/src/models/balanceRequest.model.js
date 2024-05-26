import { DataTypes } from 'sequelize';
import sequelize from '../database.js';// Ruta correcta al archivo donde has configurado la conexión a la base de datos
import Client from './client.js';
import StatusBalance from './statusBalance.js';

const BalanceRequest = sequelize.define('balanceRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  statusBalance_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: StatusBalance,
      key: 'id'
    }
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'balance_requests',
  timestamps: false
});

Client.hasMany(BalanceRequest, { foreignKey: 'client_id' });
BalanceRequest.belongsTo(Client, { foreignKey: 'client_id' });

StatusBalance.hasMany(BalanceRequest, { foreignKey: 'statusBalance_id' });
BalanceRequest.belongsTo(StatusBalance, { foreignKey: 'statusBalance_id' });

export default BalanceRequest;
