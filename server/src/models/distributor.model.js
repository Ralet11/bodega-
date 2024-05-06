import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import DistProduct from './DistProduct.js';

const Distributor = sequelize.define('Distributor', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Definir la relación con DistProduct
Distributor.hasMany(DistProduct, { foreignKey: 'id_proveedor' });

export default Distributor;