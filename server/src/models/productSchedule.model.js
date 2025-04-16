export default (sequelize, DataTypes) => {
    const ProductSchedule = sequelize.define('ProductSchedule', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'products', key: 'id' }
      },
      startTime: {
        type: DataTypes.TIME,
        allowNull: false
      },
      endTime: {
        type: DataTypes.TIME,
        allowNull: false
      }
    }, {
      tableName: 'product_schedules',
      timestamps: false
    });
  
    ProductSchedule.associate = (models) => {
      ProductSchedule.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
    };
  
    return ProductSchedule;
  };
  