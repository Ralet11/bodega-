import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import DistProduct from './distProducts.model.js';


const DistOrderProduct = sequelize.define('distOrderProduct', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'distOrderProducts',
    timestamps: false
  });

  DistOrderProduct.belongsTo(DistProduct, { foreignKey: 'product_id' });

export default DistOrderProduct;