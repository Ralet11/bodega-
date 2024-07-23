'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(130),
        allowNull: false
      },
      birthdate: {
        type: Sequelize.STRING(45),
        defaultValue: null
      },
      phone: {
        type: Sequelize.STRING(45),
        allowNull: false
      },
      subscription: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      balance: {
        type: Sequelize.FLOAT(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      savings: {
        type: Sequelize.FLOAT(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      stripeCustomerId: {
        type: Sequelize.STRING,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
