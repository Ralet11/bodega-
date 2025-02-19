export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
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
    email: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(130),
      allowNull: true
    },
    birthdate: {
      type: DataTypes.STRING(45),
      defaultValue: null
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    subscription: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    balance: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    savings: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
      defaultValue: 0.00
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    authMethod: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'local'
    },
    appleUserId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: false
  });

  User.associate = (models) => {
    User.hasMany(models.Address, { foreignKey: 'users_id', as: 'addresses' });
    User.hasMany(models.Order, { foreignKey: 'users_id', as: 'orders' });
    User.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
    User.hasMany(models.UserPromotions, { foreignKey: 'userId', as: 'userPromotions' });
    User.hasMany(models.UserDiscount, { foreignKey: 'user_id', as: 'userDiscounts' });
    User.hasMany(models.UserBodegaProSubs, { foreignKey: 'user_id' });
  };

  return User;
};
