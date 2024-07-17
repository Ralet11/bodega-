import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

const UserBodegaProSubs = sequelize.define('UserBodegaProSubs', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  subscription_id: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'user_bodega_pro_subs',
  timestamps: true
});

export default UserBodegaProSubs;