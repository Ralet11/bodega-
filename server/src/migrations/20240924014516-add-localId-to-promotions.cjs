'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregar la columna localId a la tabla promotions
    await queryInterface.addColumn('promotions', 'localId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'local', // Nombre de la tabla de locales
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar la columna localId en caso de rollback
    await queryInterface.removeColumn('promotions', 'localId');
  }
};
