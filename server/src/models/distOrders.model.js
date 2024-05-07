import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import DistOrderProduct from './distOrderProduct.model.js';

const DistOrder = sequelize.define('distOrder', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    local_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    tableName: 'distOrders',
    timestamps: false
  });

DistOrder.hasMany(DistOrderProduct, { foreignKey: 'order_id' });
DistOrderProduct.belongsTo(DistOrder, { foreignKey: 'order_id' });

export default DistOrder;