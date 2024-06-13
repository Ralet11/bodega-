'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregar nuevos campos
    await queryInterface.addColumn('adresses', 'name', {
      type: Sequelize.STRING(100),
      allowNull: false
    });

    await queryInterface.addColumn('adresses', 'formatted_address', {
      type: Sequelize.STRING(255),
      allowNull: false
    });

    // Eliminar campos obsoletos
    await queryInterface.removeColumn('adresses', 'street_number');
    await queryInterface.removeColumn('adresses', 'unit_number');
    await queryInterface.removeColumn('adresses', 'address_line1');
    await queryInterface.removeColumn('adresses', 'address_line2');
    await queryInterface.removeColumn('adresses', 'city');
    await queryInterface.removeColumn('adresses', 'postal_code');
    await queryInterface.removeColumn('adresses', 'lat');
    await queryInterface.removeColumn('adresses', 'lng');
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir la migración (agregar columnas eliminadas)
    await queryInterface.addColumn('adresses', 'street_number', {
      type: Sequelize.STRING(45),
      allowNull: false
    });

    await queryInterface.addColumn('adresses', 'unit_number', {
      type: Sequelize.STRING(45),
      allowNull: false
    });

    await queryInterface.addColumn('adresses', 'address_line1', {
      type: Sequelize.STRING(45),
      allowNull: false
    });

    await queryInterface.addColumn('adresses', 'address_line2', {
      type: Sequelize.STRING(45),
      defaultValue: null
    });

    await queryInterface.addColumn('adresses', 'city', {
      type: Sequelize.STRING(45),
      allowNull: false
    });

    await queryInterface.addColumn('adresses', 'postal_code', {
      type: Sequelize.INTEGER,
      defaultValue: null
    });

    await queryInterface.addColumn('adresses', 'lat', {
      type: Sequelize.FLOAT,
      allowNull: false
    });

    await queryInterface.addColumn('adresses', 'lng', {
      type: Sequelize.FLOAT,
      allowNull: false
    });

    // Eliminar los nuevos campos agregados
    await queryInterface.removeColumn('adresses', 'name');
    await queryInterface.removeColumn('adresses', 'formatted_address');
  }
};
