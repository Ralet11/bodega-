//pendiente

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('clients', 'address', {
      type: Sequelize.STRING(45),
      allowNull: true,
    });

    await queryInterface.changeColumn('clients', 'phone', {
      type: Sequelize.STRING(45),
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('clients', 'address', {
      type: Sequelize.STRING(45),
      allowNull: false,
    });

    await queryInterface.changeColumn('clients', 'phone', {
      type: Sequelize.STRING(45),
      allowNull: false,
      defaultValue: null,
    });
  }
};