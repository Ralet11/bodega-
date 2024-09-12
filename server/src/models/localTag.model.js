import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Local from './local.js';
import Tag from './tag.model.js';

const LocalTag = sequelize.define('local_tag', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  tag_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  local_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'local_tag',
  timestamps: false
});

// Relaciones con Tag y Local


export default LocalTag;