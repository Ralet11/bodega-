import { DataTypes } from 'sequelize';
import sequelize from '../database.js';


const DistProduct = sequelize.define('DistProduct', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  id_proveedor: {
    type: DataTypes.INTEGER,
    
    allowNull: true,
 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  

  image1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image3: {
    type: DataTypes.STRING,
    allowNull: true
  },

  feature_1: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_2: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_3: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_4: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_5: {
    type: DataTypes.STRING,
    allowNull: false
  },
  feature_6: {
    type: DataTypes.STRING,
    allowNull: false
  },



  
});

export default DistProduct;