'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Paso 1: Agregar la columna `clientId` permitiendo nulos temporalmente
    await queryInterface.addColumn('products', 'clientId', {
      type: Sequelize.INTEGER,
      allowNull: true // Permitir valores nulos temporalmente
    });

    // Paso 2: Asignar un `clientId` válido a todos los registros existentes
    // Reemplaza `1` con un `clientId` válido para tu caso
    await queryInterface.sequelize.query(`
      UPDATE products
      SET "clientId" = 1
      WHERE "clientId" IS NULL
    `);

    // Paso 3: Modificar la columna `clientId` para no permitir valores nulos
    await queryInterface.changeColumn('products', 'clientId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Eliminar la columna `clientId`
    await queryInterface.removeColumn('products', 'clientId');
  }
};
