import { DataTypes } from 'sequelize';
import sequelize from '../database.js'; // Ruta correcta al archivo donde has configurado la conexión a la base de datos

import Local from './local.js'; // Suponiendo que tengas un modelo de Local en otro archivo

const Category = sequelize.define('category', {
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
  img: {
    type: DataTypes.STRING(45),
    defaultValue: null
  },
  local_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING(255),
    defaultValue: null
  }
}, {
  tableName: 'categories',
  timestamps: false
});

// Definición de la relación con la tabla de locales
Category.belongsTo(Local, { foreignKey: 'local_id', as: 'local' });

export default Category;