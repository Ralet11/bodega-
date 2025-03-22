import { Sequelize } from 'sequelize';
import { DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD } from './config.js';

console.log(DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, "envs")

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
});

export default sequelize;