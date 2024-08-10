//pendiente

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('orders', 'deliveryAddress', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('orders', 'deliveryAddress');
  }
};
