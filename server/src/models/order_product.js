import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../database'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

import Order from './order'; // Suponiendo que tengas un modelo de Order en otro archivo
import Product from './product'; // Suponiendo que tengas un modelo de Product en otro archivo

const OrderProduct = sequelize.define('order_product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  products_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'order_products',
  timestamps: false
});

// Definición de la relación con la tabla de orders
OrderProduct.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Definición de la relación con la tabla de products
OrderProduct.belongsTo(Product, { foreignKey: 'products_id', as: 'product' });

export default OrderProduct;