import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Client from './client.js'; // Importar el modelo Client
import Product from './product.js'; // Importar el modelo Product
import PromotionType from './promotionType.js'; // Importar el modelo PromotionType
import Local from './local.js'; // Importar el modelo Local

const Promotion = sequelize.define('promotion', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  localId: { // Agregar el campo localId
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  promotionTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'promotions',
  timestamps: false
});

// Definición de las relaciones
Promotion.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

Promotion.belongsTo(PromotionType, { foreignKey: 'promotionTypeId', as: 'promotionType' });

export default Promotion;
