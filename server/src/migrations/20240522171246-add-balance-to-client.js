'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Clients', // nombre de la tabla en la base de datos
      'balance', // nombre de la nueva columna
      {
        type: Sequelize.FLOAT,
        allowNull: true,
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Clients', 'balance');
  }
};