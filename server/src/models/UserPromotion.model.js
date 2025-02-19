export default (sequelize, DataTypes) => {
  const UserPromotions = sequelize.define('UserPromotions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    localId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    purchaseCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    rewardCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    tableName: 'user_promotions',
    timestamps: false
  });

  UserPromotions.associate = (models) => {
    UserPromotions.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    UserPromotions.belongsTo(models.Local, { foreignKey: 'localId', as: 'local' });
  };

  return UserPromotions;
};
