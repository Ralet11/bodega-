import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import LocalCategory from './local_category.js';  // Asegúrate de importar correctamente el modelo de categoría

const Tag = sequelize.define('tag', {
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
  local_category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  img: {
    type: DataTypes.STRING,
    allowNull: true, // Este campo es opcional
    defaultValue: null
  }
}, {
  tableName: 'tag',
  timestamps: false
});

// Relación con LocalCategory
Tag.belongsTo(LocalCategory, { foreignKey: 'local_category_id', as: 'localCategory' });

export default Tag;
