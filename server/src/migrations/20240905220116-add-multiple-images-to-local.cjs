module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregar columnas logo, placeImage y deliveryImage
    await queryInterface.addColumn('local', 'logo', {
      type: Sequelize.STRING(255),
      defaultValue: 'https://www.mnasbo.org/global_graphics/default-store-350x350.jpg',
      allowNull: true,
    });

    await queryInterface.addColumn('local', 'placeImage', {
      type: Sequelize.STRING(255),
      defaultValue: 'https://www.mnasbo.org/global_graphics/default-store-350x350.jpg',
      allowNull: true,
    });

    await queryInterface.addColumn('local', 'deliveryImage', {
      type: Sequelize.STRING(255),
      defaultValue: 'https://www.mnasbo.org/global_graphics/default-store-350x350.jpg',
      allowNull: true,
    });

    // Eliminar la columna img
    await queryInterface.removeColumn('local', 'img');
  },

  down: async (queryInterface, Sequelize) => {
    // Revertir la eliminación de la columna img
    await queryInterface.addColumn('local', 'img', {
      type: Sequelize.STRING(255),
      defaultValue: 'https://www.mnasbo.org/global_graphics/default-store-350x350.jpg',
      allowNull: true,
    });

    // Eliminar las columnas logo, placeImage y deliveryImage
    await queryInterface.removeColumn('local', 'logo');
    await queryInterface.removeColumn('local', 'placeImage');
    await queryInterface.removeColumn('local', 'deliveryImage');
  }
};