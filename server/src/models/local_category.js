import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

const LocalCategory = sequelize.define('local_category', {
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
  image: {
    type: DataTypes.STRING(255),
    defaultValue: null,
  },
}, {
  tableName: 'locals_categories',
  timestamps: false,
});

export default LocalCategory;
