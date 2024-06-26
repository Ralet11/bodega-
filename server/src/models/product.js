import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../database.js';

import Category from './category.js';
import Client from './client.js'; // Importar el modelo Client

const Product = sequelize.define('product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING(300),
    allowNull: false
  },
  img: {
    type: DataTypes.STRING(600),
    allowNull: false
  },
  categories_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  clientId: { // Nuevo campo clientId
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

// Definición de las relaciones
Product.belongsTo(Category, { foreignKey: 'categories_id', as: 'category' });
Product.belongsTo(Client, { foreignKey: 'clientId', as: 'client' }); // Nueva relación

export default Product;
