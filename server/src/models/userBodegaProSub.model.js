export default (sequelize, DataTypes) => {
  const UserBodegaProSubs = sequelize.define('UserBodegaProSubs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    subscription_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'user_bodega_pro_subs',
    timestamps: true
  });

  UserBodegaProSubs.associate = (models) => {
    UserBodegaProSubs.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return UserBodegaProSubs;
};
