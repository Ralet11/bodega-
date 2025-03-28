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
      allowNull: false,
      defaultValue: 0
    },
    finalPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
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
      defaultValue: 0, // Valor por defecto
      validate: {
        isIn: [[0, 1, 2]] // Asegura que solo se acepten los valores 0, 1 o 2
      }
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
  };

  return Product;
};
