import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Subcategory from './subCategories.js';
import Brand from './brands.models.js';

const DistProduct = sequelize.define('DistProduct', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subcategory_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Subcategory,
      key: 'id',
    },
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image1: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feature_1: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feature_2: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feature_3: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feature_4: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feature_5: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  feature_6: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
  },
  brand_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Brand,
      key: 'id',
    },
  },
});

DistProduct.belongsTo(Subcategory, { foreignKey: 'subcategory_id', as: 'subcategory' });
DistProduct.belongsTo(Brand, { foreignKey: 'brand_id', as: 'brand' }); // Define la relación con Brand

export default DistProduct;
