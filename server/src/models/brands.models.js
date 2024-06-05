
import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Subcategory from './subCategories.js';

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(45),
    allowNull: false,
  },
  subcategory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Subcategory,
      key: 'id',
    },
  },
}, {
  tableName: 'brands',
  timestamps: true,
});

// Relación con Subcategory
Brand.belongsTo(Subcategory, { foreignKey: 'subcategory_id', as: 'subcategory' });

export default Brand;