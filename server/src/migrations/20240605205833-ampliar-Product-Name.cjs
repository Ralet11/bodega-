'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('products', 'name', {
      type: Sequelize.STRING(300),
      allowNull: false
    });

    await queryInterface.changeColumn('products', 'description', {
      type: Sequelize.STRING(300),
      allowNull: false
    });

    await queryInterface.changeColumn('products', 'img', {
      type: Sequelize.STRING(600),
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('products', 'name', {
      type: Sequelize.STRING(45),
      allowNull: false
    });

    await queryInterface.changeColumn('products', 'description', {
      type: Sequelize.STRING(45),
      allowNull: false
    });

    await queryInterface.changeColumn('products', 'img', {
      type: Sequelize.STRING(255),
      allowNull: false
    });
  }
};
