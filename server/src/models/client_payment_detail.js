import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

import Client from './client.js'; // Suponiendo que tengas un modelo de Client en otro archivo
import PayMethod from './pay_methods.js'; // Suponiendo que tengas un modelo de PayMethod en otro archivo

const ClientPaymentDetail = sequelize.define('client_payment_detail', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  client_id: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  pay_method_id: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  secret_key: {
    type: DataTypes.STRING(255),
    defaultValue: null
  },
  publishable_key: {
    type: DataTypes.STRING(245),
    defaultValue: null
  }
}, {
  tableName: 'client_payment_details',
  timestamps: false
});

// Definición de la relación con la tabla de clients
ClientPaymentDetail.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

// Definición de la relación con la tabla de pay_methods
ClientPaymentDetail.belongsTo(PayMethod, { foreignKey: 'pay_method_id', as: 'pay_method' });

export default ClientPaymentDetail;
