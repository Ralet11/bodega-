import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import User from './user.js';
import Local from './local.js';

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
  localId: { // Nueva relación con Local
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  purchaseCount: { // Total de compras realizadas
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  rewardCount: { // Contador de productos canjeados
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
}, {
  tableName: 'user_promotions',
  timestamps: false,
});

// Definir relaciones
UserPromotions.belongsTo(User, { foreignKey: 'userId', as: 'user' });
UserPromotions.belongsTo(Local, { foreignKey: 'localId', as: 'local' });

// Relaciones inversas
User.hasMany(UserPromotions, { foreignKey: 'userId', as: 'userPromotions' });
Local.hasMany(UserPromotions, { foreignKey: 'localId', as: 'userPromotions' });

export default UserPromotions;
