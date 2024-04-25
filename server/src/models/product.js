import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../database.js';

import Category from './category.js'; // Suponiendo que tengas un modelo de Categoría en otro archivo

const Product = sequelize.define('product', {
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
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  img: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  categories_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(255),
    defaultValue: null
  }
}, {
  tableName: 'products',
  timestamps: false
});

// Definición de la relación con la tabla de categorías
Product.belongsTo(Category, { foreignKey: 'categories_id', as: 'category' });

export default Product;