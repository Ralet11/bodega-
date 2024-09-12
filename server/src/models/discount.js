import { DataTypes } from 'sequelize';
import sequelize from '../database.js';

import Local from './local.js';
import Product from './product.js';
import Category from './category.js';

const Discount = sequelize.define('discount', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  productName: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  limitDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  img: {  // Cambiado de 'image' a 'img'
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.INTEGER,
    defaultValue: null
  },
  local_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Local',
      key: 'id'
    }
  },
  percentage: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fixedValue: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  order_details: {
    type: DataTypes.JSON,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Product',
      key: 'id'
    }
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Category',
      key: 'id'
    }
  },
  usageLimit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  },
  timesUsed: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discountType: {
    type: DataTypes.ENUM('percentage', 'fixed'),
    allowNull: false,
    defaultValue: 'percentage'
  },
  minPurchaseAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  maxDiscountAmount: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  conditions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  delivery: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isIn: [[0, 1, 2]]
    }
  }
}, {
  tableName: 'discounts',
  timestamps: false
});

// Definición de las relaciones con las tablas de Local, Product y Category

Discount.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
Discount.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
Product.hasMany(Discount, { foreignKey: 'product_id', as: 'discounts' });

export default Discount;
