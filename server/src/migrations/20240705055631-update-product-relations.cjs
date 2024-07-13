'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verifica si ya existen las claves foráneas y añádelas si no están presentes
    await queryInterface.addConstraint('productExtras', {
      fields: ['productId'],
      type: 'foreign key',
      name: 'fk_productExtras_productId',
      references: {
        table: 'products',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('productExtras', {
      fields: ['extraId'],
      type: 'foreign key',
      name: 'fk_productExtras_extraId',
      references: {
        table: 'extras',
        field: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Elimina las claves foráneas añadidas
    await queryInterface.removeConstraint('productExtras', 'fk_productExtras_productId');
    await queryInterface.removeConstraint('productExtras', 'fk_productExtras_extraId');
  }
};
