import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

import User from './user.js'
import Discount from './discount.js';

const UserDiscount = sequelize.define('user_discount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  discount_id: {
    type: DataTypes.INTEGER, // Cambiado a INTEGER para coincidir con el tipo de dato en la tabla de descuentos
    allowNull: false,
    references: {
      model: Discount, // Hace referencia al modelo de la tabla de descuentos
      key: 'id' // Clave primaria en la tabla de descuentos
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User, // Hace referencia al modelo de la tabla de usuarios
      key: 'id' // Clave primaria en la tabla de usuarios
    }
  }
}, {
  tableName: 'user_discounts', // Nombre de la tabla cambiado para reflejar su relación con los usuarios
  timestamps: false
});

// Definir relaciones
User.belongsToMany(Discount, { through: UserDiscount, foreignKey: 'user_id' }); // Relación muchos a muchos entre User y Discount a través de UserDiscount
Discount.belongsToMany(User, { through: UserDiscount, foreignKey: 'discount_id' }); // Relación muchos a muchos entre Discount y User a través de UserDiscount

export default UserDiscount;