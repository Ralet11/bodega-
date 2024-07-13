import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

// Definición del modelo ExtraOption
const ExtraOption = sequelize.define('extraOption', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  extra_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'extras',
      key: 'id'
    }
  }
}, {
  tableName: 'extra_options',
  timestamps: false
});

export default ExtraOption;
