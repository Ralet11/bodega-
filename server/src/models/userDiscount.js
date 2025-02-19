export default (sequelize, DataTypes) => {
  const UserDiscount = sequelize.define('UserDiscount', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    used: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'user_discounts',
    timestamps: false
  });

  UserDiscount.associate = (models) => {
    UserDiscount.belongsTo(models.User, { foreignKey: 'user_id' });
    UserDiscount.belongsTo(models.Product, { foreignKey: 'product_id' });

    // Many-to-many si así lo deseas:
    models.User.belongsToMany(models.Product, {
      through: UserDiscount,
      foreignKey: 'user_id',
      otherKey: 'product_id'
    });
    models.Product.belongsToMany(models.User, {
      through: UserDiscount,
      foreignKey: 'product_id',
      otherKey: 'user_id'
    });

    // O la versión hasMany, dependiendo de tu lógica
    models.User.hasMany(UserDiscount, { foreignKey: 'user_id' });
    models.Product.hasMany(UserDiscount, { foreignKey: 'product_id' });
  };

  return UserDiscount;
};
