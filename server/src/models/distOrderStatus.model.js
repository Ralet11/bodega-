import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; 

const DistOrderStatus = sequelize.define('distOrderStatus', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
        type: DataTypes.STRING(55),
        allowNull: false
    }
}, {
  tableName: 'distOrderStatus',
  timestamps: false
});

export default DistOrderStatus;