import { Sequelize } from 'sequelize';
import { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD } from './config.js';

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql', // Cambia el dialecto a 'mysql'
  logging: false,
});

export default sequelize;