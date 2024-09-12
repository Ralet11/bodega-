import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import ExtraOption from './extraOption.model.js';

// Definición del modelo Extra
const Extra = sequelize.define('extra', {
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
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  onlyOne: {  // Nuevo campo añadido
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'extras',
  timestamps: false
});

// Definir la relación entre Extra y ExtraOption
Extra.hasMany(ExtraOption, { foreignKey: 'extra_id', as: 'options' });
ExtraOption.belongsTo(Extra, { foreignKey: 'extra_id', as: 'extra' });

export default Extra;