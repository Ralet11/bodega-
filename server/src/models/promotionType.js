export default (sequelize, DataTypes) => {
  const PromotionType = sequelize.define('PromotionType', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    tableName: 'promotionTypes',
    timestamps: false
  });

  PromotionType.associate = (models) => {
    PromotionType.hasMany(models.Promotion, { foreignKey: 'promotionTypeId', as: 'promotions' });
  };

  return PromotionType;
};
