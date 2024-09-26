import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const PromotionType = sequelize.define('promotionType', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  }
}, {
  tableName: 'promotionTypes',
  timestamps: false
});

export default PromotionType;
