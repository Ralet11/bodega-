export default (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    finalPrice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    img: {
      type: DataTypes.STRING(600),
      allowNull: false
    },
    categories_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(255),
      defaultValue: null
    },
    availableFor: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: [[0, 1, 2]]
      }
    },
    preparationTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isIn: [[15, 20, 25, 30, 40]]
      }
    },
    // Nuevo flag para identificar si el descuento se aplica 24 hs
    AlwaysActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "Si es true, el descuento está activo las 24 hs"
    },
    // Campo opcional para definir los horarios de descuento si no es 24 hs
    discountSchedule: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null
    }
  }, {
    tableName: 'products',
    timestamps: false
  });

  Product.associate = (models) => {
    Product.belongsTo(models.Category, { foreignKey: 'categories_id', as: 'category' });
    Product.belongsTo(models.Client, { foreignKey: 'clientId', as: 'client' });
    Product.hasMany(models.Extra, { foreignKey: 'productId', as: 'extras' });
    Product.hasMany(models.Promotion, { foreignKey: 'productId', as: 'promotions' });
    Product.hasMany(models.ProductSchedule, { foreignKey: 'productId', as: 'productSchedules' });
  };

  return Product;
};
