export default (sequelize, DataTypes) => {
  const OrderProduct = sequelize.define('OrderProduct', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    products_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'order_products',
    timestamps: false
  });

  OrderProduct.associate = (models) => {
    OrderProduct.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
    OrderProduct.belongsTo(models.Product, { foreignKey: 'products_id', as: 'product' });
  };

  return OrderProduct;
};
