import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Product from './product.js';
import Extra from './extra.js';

const ProductExtra = sequelize.define('productExtra', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  extraId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Extra,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'productExtras',
  timestamps: false
});

export default ProductExtra;
