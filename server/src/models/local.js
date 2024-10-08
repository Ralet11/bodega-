import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Client from './client.js';
import LocalCategory from './local_category.js';
import ShopOpenHours from './shopOpenHoursModel.js';
import Discount from './discount.js';
import Tag from './tag.model.js';
import LocalTag from './localTag.model.js';
import Promotion from './promotions.model.js';

const defaultImageUrl = 'https://www.mnasbo.org/global_graphics/default-store-350x350.jpg';

const Local = sequelize.define('local', {
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
  // Agregar campos para las imágenes
  logo: {
    type: DataTypes.STRING(255),
    defaultValue: defaultImageUrl
  },
  placeImage: {
    type: DataTypes.STRING(255),
    defaultValue: defaultImageUrl
  },
  deliveryImage: {
    type: DataTypes.STRING(255),
    defaultValue: defaultImageUrl
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
  category: {
    type: DataTypes.STRING(50),
    defaultValue: null
  },
  locals_categories_id: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0.00,
      max: 5.00
    }
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

// Relaciones
Local.belongsTo(Client, { foreignKey: 'clients_id', as: 'client' });
Local.belongsTo(LocalCategory, { foreignKey: 'locals_categories_id', as: 'local_category' });
Local.hasMany(ShopOpenHours, { foreignKey: 'local_id', as: 'openingHours' });
Local.hasMany(Discount, { foreignKey: 'local_id', as: 'discounts' });
Local.belongsToMany(Tag, { through: LocalTag, foreignKey: 'local_id', as: 'tags' });
Tag.belongsToMany(Local, { through: LocalTag, foreignKey: 'tag_id', as: 'locals' });
LocalTag.belongsTo(Tag, { foreignKey: 'tag_id', as: 'tag' });
LocalTag.belongsTo(Local, { foreignKey: 'local_id', as: 'local' });
Promotion.belongsTo(Local, { foreignKey: 'localId', as: 'local' }); // Relación con Local

export default Local;