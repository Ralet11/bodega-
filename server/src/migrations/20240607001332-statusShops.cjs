'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Modificar la columna 'status' para establecer el valor por defecto en '1'
    await queryInterface.changeColumn('local', 'status', {
      type: Sequelize.STRING(45),
      defaultValue: '1',
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    // Revertir la columna 'status' a su estado anterior (valor por defecto null)
    await queryInterface.changeColumn('local', 'status', {
      type: Sequelize.STRING(45),
      defaultValue: null,
      allowNull: true
    });
  }
};
