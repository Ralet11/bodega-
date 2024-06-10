import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import LocalCategory from './local_category.js';

const Subcategory = sequelize.define('Subcategory', {
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
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: LocalCategory,
      key: 'id',
    },
  },
  imagen: {
    type: DataTypes.STRING(600),
    allowNull: true,
  },
}, {
  tableName: 'subcategories',
  timestamps: false,
});

Subcategory.belongsTo(LocalCategory, { foreignKey: 'category_id', as: 'localCategory' });

export default Subcategory;