export default (sequelize, DataTypes) => {
  const Promotion = sequelize.define('Promotion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    localId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    promotionTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'promotions',
    timestamps: false
  });

  Promotion.associate = (models) => {
    Promotion.belongsTo(models.Client, { foreignKey: 'clientId', as: 'client' });
    Promotion.belongsTo(models.PromotionType, { foreignKey: 'promotionTypeId', as: 'promotionType' });
    Promotion.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    Promotion.belongsTo(models.Local, { foreignKey: 'localId', as: 'local' });
  };

  return Promotion;
};
