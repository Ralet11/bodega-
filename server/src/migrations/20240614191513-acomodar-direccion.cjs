module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('adresses', 'houseNumber', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
    await queryInterface.addColumn('adresses', 'streetName', {
      type: Sequelize.STRING(100),
      allowNull: true,
    });
    await queryInterface.addColumn('adresses', 'additionalDetails', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.addColumn('adresses', 'postalCode', {
      type: Sequelize.STRING(20),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('adresses', 'houseNumber');
    await queryInterface.removeColumn('adresses', 'streetName');
    await queryInterface.removeColumn('adresses', 'additionalDetails');
    await queryInterface.removeColumn('adresses', 'postalCode');
  }
};