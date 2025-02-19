
export default (sequelize, DataTypes) => {
  const Local = sequelize.define('Local', {
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
    address: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING(255),
      defaultValue: 'https://www.mnasbo.org/global_graphics/default-store-350x350.jpg'
    },
    placeImage: {
      type: DataTypes.STRING(255),
      defaultValue: 'https://www.mnasbo.org/global_graphics/default-store-350x350.jpg'
    },
    deliveryImage: {
      type: DataTypes.STRING(255),
      defaultValue: 'https://www.mnasbo.org/global_graphics/default-store-350x350.jpg'
    },
    status: {
      type: DataTypes.STRING(45),
      defaultValue: '1',
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    clients_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lat: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    locals_categories_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'locals_categories',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00
    },
    ratingSum: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.00
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    delivery: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    pickUp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    orderIn: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    tableName: 'local',
    timestamps: false
  });

  Local.associate = (models) => {
    Local.belongsTo(models.Client, { foreignKey: 'clients_id', as: 'client' });
    Local.hasMany(models.Category, { foreignKey: 'local_id', as: 'categories' });
    Local.hasMany(models.ShopOpenHours, { foreignKey: 'local_id', as: 'openingHours' });
    Local.belongsToMany(models.Tag, {
      through: models.LocalTag,
      foreignKey: 'local_id',
      as: 'tags'
    });
    Local.hasMany(models.Review, { foreignKey: 'local_id', as: 'reviews' });
    Local.hasMany(models.UserPromotions, { foreignKey: 'localId', as: 'userPromotions' });
    Local.hasMany(models.Promotion, { foreignKey: 'localId', as: 'promotions' });
    Local.hasMany(models.Order, { foreignKey: 'local_id', as: 'orders' });
    Local.belongsTo(models.LocalCategory, {
      foreignKey: {
        name: 'locals_categories_id',
        allowNull: true
      },
      as: 'localCategory',
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  };

  return Local;
};