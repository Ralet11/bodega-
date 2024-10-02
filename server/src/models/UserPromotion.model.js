import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import User from './user.js';
import Promotion from './promotions.model.js';

const UserPromotions = sequelize.define('userPromotions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  promotionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  purchaseCount: { // Almacena la cantidad de compras realizadas por el usuario
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  rewardReceived: { // Indica si el usuario ya recibió el producto gratuito
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  }
}, {
  tableName: 'user_promotions',
  timestamps: false,
});

// Definir relaciones
UserPromotions.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserPromotions.belongsTo(Promotion, { foreignKey: 'promotionId', as: 'promotion' });

// También puedes definir las relaciones inversas
User.hasMany(UserPromotions, { foreignKey: 'userId', as: 'userPromotions' });
Promotion.hasMany(UserPromotions, { foreignKey: 'promotionId', as: 'userPromotions' });

export default UserPromotions;