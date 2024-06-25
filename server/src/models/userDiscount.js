import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import User from './user.js';
import Discount from './discount.js';

// Definición del modelo UserDiscount
const UserDiscount = sequelize.define('user_discount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  discount_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Discount,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  used: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false // Por defecto, el descuento no ha sido usado
  }
}, {
  tableName: 'user_discounts',
  timestamps: false
});

// Definir relaciones
User.belongsToMany(Discount, { through: UserDiscount, foreignKey: 'user_id' });
Discount.belongsToMany(User, { through: UserDiscount, foreignKey: 'discount_id' });

UserDiscount.belongsTo(Discount, { foreignKey: 'discount_id' });
UserDiscount.belongsTo(User, { foreignKey: 'user_id' });

Discount.hasMany(UserDiscount, { foreignKey: 'discount_id' });
User.hasMany(UserDiscount, { foreignKey: 'user_id' });

export default UserDiscount