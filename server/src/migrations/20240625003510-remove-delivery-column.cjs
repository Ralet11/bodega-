'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('discounts', 'delivery');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('discounts', 'delivery', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  }
};
