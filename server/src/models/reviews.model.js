import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Local from './local.js';
import User from './user.js';

const Review = sequelize.define('review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  local_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Local,
      key: 'id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0.00,
      max: 5.00,
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true, // Puede ser nulo si el usuario no desea dejar un mensaje.
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Por defecto, se asigna la fecha y hora actuales.
  },
}, {
  tableName: 'reviews',
  timestamps: true, // Habilita createdAt y updatedAt automáticamente.
  updatedAt: false, // Deshabilita el campo updatedAt si no es necesario.
});

// Relación de Review con Local y User
Review.belongsTo(Local, { foreignKey: 'local_id', as: 'local' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Local.hasMany(Review, { foreignKey: 'local_id', as: 'reviews' });
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });

export default Review;